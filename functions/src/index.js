import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { logger } from 'firebase-functions'
import { getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import pg from 'pg'

const { Pool } = pg
const databaseUrl = defineSecret('DATABASE_URL')

if (getApps().length === 0) initializeApp()

let pool
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl.value(),
      max: 5,
      idleTimeoutMillis: 30_000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  }
  return pool
}

async function requireUser(request) {
  const header = request.headers.authorization || ''
  if (!header.startsWith('Bearer ')) {
    const error = new Error('Missing Firebase ID token')
    error.status = 401
    throw error
  }

  try {
    return await getAuth().verifyIdToken(header.slice(7))
  } catch {
    const error = new Error('Invalid Firebase ID token')
    error.status = 401
    throw error
  }
}

function sendError(response, error) {
  const status = error.status || 500
  if (status >= 500) logger.error(error)
  response.status(status).json({ error: status >= 500 ? 'Internal server error' : error.message })
}

export const api = onRequest(
  { region: 'asia-southeast1', secrets: [databaseUrl], cors: true },
  async (request, response) => {
    try {
      const user = await requireUser(request)
      const database = getPool()

      if (request.method === 'GET' && request.path === '/health') {
        await database.query('select 1')
        response.json({ ok: true, userId: user.uid })
        return
      }

      if (request.method === 'GET' && request.path === '/v1/srs/cards') {
        const result = await database.query(
          `select id, word_id, card_kind, state, due_at, interval_days, ease, reps, lapses, last_review_at
           from srs_cards where user_id = $1 order by due_at asc`,
          [user.uid],
        )
        response.json({ cards: result.rows })
        return
      }

      if (request.method === 'POST' && request.path === '/v1/srs/reviews') {
        const { cardId, wordId, cardKind = 'recognition', rating, intervalDays, ease, state, dueAt } = request.body || {}
        if (!cardId || !wordId || !Number.isInteger(rating) || rating < 1 || rating > 4) {
          const error = new Error('cardId, wordId and rating 1-4 are required')
          error.status = 400
          throw error
        }

        const client = await database.connect()
        try {
          await client.query('begin')
          await client.query(
            `insert into srs_cards
              (id, user_id, word_id, card_kind, state, due_at, interval_days, ease, reps, lapses, last_review_at, updated_at)
             values ($1, $2, $3, $4, $5, $6, $7, $8, 1, case when $9 < 3 then 1 else 0 end, now(), now())
             on conflict (user_id, id) do update set
               state = excluded.state, due_at = excluded.due_at, interval_days = excluded.interval_days,
               ease = excluded.ease, reps = srs_cards.reps + 1,
               lapses = srs_cards.lapses + case when $9 < 3 then 1 else 0 end,
               last_review_at = now(), updated_at = now()`,
            [cardId, user.uid, wordId, cardKind, state || 'review', dueAt ? new Date(dueAt) : new Date(), intervalDays || 0, ease || 2.5, rating],
          )
          await client.query(
            `insert into review_logs (user_id, card_id, word_id, card_kind, rating, interval_days, ease)
             values ($1, $2, $3, $4, $5, $6, $7)`,
            [user.uid, cardId, wordId, cardKind, rating, intervalDays || 0, ease || 2.5],
          )
          await client.query('commit')
        } catch (error) {
          await client.query('rollback')
          throw error
        } finally {
          client.release()
        }

        response.status(201).json({ ok: true })
        return
      }

      const error = new Error('Route not found')
      error.status = 404
      throw error
    } catch (error) {
      sendError(response, error)
    }
  },
)
