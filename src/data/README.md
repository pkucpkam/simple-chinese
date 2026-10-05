# Data layer

`data.js` is the single entry point for local seed data. Feature components should not import `mock*.js` files directly.

`repositories.js` owns the read/write contract used by the UI. The current implementation is in-memory so the app works without a backend:

- `vocabRepository`: list, getById, create, update, remove
- `grammarRepository`: list, getById
- `examRepository`: listSections, listQuestions
- `pinyinRepository`: listInitials, listFinals, listTones, listToneRules, listQuizQuestions
- `progressRepository`: read-only dashboard data

When PostgreSQL is introduced, keep the components unchanged and replace repository methods with API calls such as `fetch('/api/vocab')`. The server API should own PostgreSQL access, validation, authentication, and transactions; the browser should never connect to PostgreSQL directly.

Recommended table boundaries:

- `vocab_words`: user vocabulary and HSK metadata
- `grammar_points`, `grammar_exercises`: grammar content
- `exam_sections`, `exam_questions`: exam content
- `study_activity`, `user_progress`: learner activity and progress
