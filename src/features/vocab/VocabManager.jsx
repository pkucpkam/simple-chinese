import { useState } from 'react'
import { Plus, Upload, Search, X } from 'lucide-react'
import { srsRepository, vocabRepository } from '../../data/repositories'
import { isLeech, isMastered } from '../../lib/srs'
import VocabForm from './VocabForm'
import BulkImport from './BulkImport'
import VocabList from './VocabList'
import VocabEmptyState from './VocabEmptyState'

const HSK_TABS = [
  { value: 'all', label: 'All' },
  { value: '1', label: 'HSK 1' },
  { value: '2', label: 'HSK 2' },
  { value: '3', label: 'HSK 3' },
]

export default function VocabManager() {
  const [words, setWords] = useState(() => vocabRepository.list())
  const [showForm, setShowForm] = useState(false)
  const [editingWord, setEditingWord] = useState(null)
  const [showBulk, setShowBulk] = useState(false)
  const [search, setSearch] = useState('')
  const [hskFilter, setHskFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  // Stats
  const counts = {
    all: words.length,
    1: words.filter(w => w.hsk === 1).length,
    2: words.filter(w => w.hsk === 2).length,
    3: words.filter(w => w.hsk === 3).length,
  }
  const now = Date.now()
  const srsCards = words.map(word => srsRepository.getCard(word))
  const srsCounts = {
    due: srsCards.filter(card => card.due <= now).length,
    mastered: srsCards.filter(isMastered).length,
    leeches: srsCards.filter(isLeech).length,
  }

  function handleAddWord(newWord) {
    vocabRepository.create(newWord)
    setWords(vocabRepository.list())
    setShowForm(false)
  }

  function handleUpdateWord(updated) {
    vocabRepository.update(updated.id, updated)
    setWords(vocabRepository.list())
    setEditingWord(null)
  }

  function handleDeleteWord(id) {
    vocabRepository.remove(id)
    srsRepository.removeByWordId(id)
    setWords(vocabRepository.list())
  }

  function handleReview(word, rating) {
    return srsRepository.review(word, rating)
  }

  function handleBulkImport(newWords) {
    newWords.forEach(word => vocabRepository.create(word))
    setWords(vocabRepository.list())
  }

  function handleEditClick(word) {
    setEditingWord(word)
    setShowForm(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openAddForm() {
    setEditingWord(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeForm = showForm || editingWord

  return (
    <div className="min-h-full">
      {/* ── Page Header ── */}
      <div className="sticky top-0 z-10 bg-[#121212]/90 backdrop-blur-md border-b border-[#4d4d4d]/20 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">Vocabulary</h1>
            <p className="text-[#b3b3b3] text-xs mt-0.5">
              {words.length} words · HSK 1–3
            </p>
          </div>
          <div className="flex gap-2">
            <button
              id="bulk-import-btn"
              onClick={() => setShowBulk(true)}
              className="flex items-center gap-1.5 bg-[#1f1f1f] hover:bg-[#252525] text-[#b3b3b3] hover:text-white
                text-sm font-medium px-4 py-2 rounded-full border border-[#4d4d4d]/50 hover:border-[#4d4d4d] transition-all duration-150"
            >
              <Upload size={15} />
              <span className="hidden sm:inline">Bulk Import</span>
            </button>
            <button
              id="add-word-btn"
              onClick={openAddForm}
              className="flex items-center gap-1.5 bg-[#1ed760] hover:bg-[#1fdf64] text-black
                font-bold text-sm px-4 py-2 rounded-full active:scale-95 transition-all duration-150"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Add Word</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: counts.all, color: 'text-white' },
            { label: 'HSK 1', value: counts[1], color: 'text-[#1ed760]' },
            { label: 'HSK 2', value: counts[2], color: 'text-[#539df5]' },
            { label: 'HSK 3', value: counts[3], color: 'text-[#ffa42b]' },
            { label: 'Due today', value: srsCounts.due, color: 'text-[#f7c948]' },
            { label: 'Mastered', value: srsCounts.mastered, color: 'text-[#539df5]' },
            { label: 'Leech', value: srsCounts.leeches, color: 'text-[#f3727f]' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#181818] rounded-2xl px-4 py-3 text-center border border-[#4d4d4d]/20">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[#b3b3b3] text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Add / Edit Form ── */}
        {activeForm && (
          <VocabForm
            initialData={editingWord}
            onSave={editingWord ? handleUpdateWord : handleAddWord}
            onCancel={() => { setShowForm(false); setEditingWord(null) }}
          />
        )}

        {/* ── Empty State ── */}
        {words.length === 0 ? (
          <VocabEmptyState onAdd={openAddForm} />
        ) : (
          <>
            {/* ── Search + Filter ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b3b3b3]" />
                <input
                  id="vocab-search"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search hanzi, pinyin, meaning…"
                  className="w-full bg-[#1f1f1f] text-white text-sm rounded-full pl-10 pr-10 py-2.5
                    placeholder-[#4d4d4d] border border-transparent focus:border-[#1ed760]/40 transition-colors"
                />
                {search && (
                  <button
                    id="clear-search"
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* HSK Filter Tabs */}
              <div className="flex gap-1 bg-[#1f1f1f] p-1 rounded-full shrink-0">
                {HSK_TABS.map(tab => (
                  <button
                    key={tab.value}
                    id={`filter-${tab.value}`}
                    onClick={() => setHskFilter(tab.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
                      ${hskFilter === tab.value
                        ? 'bg-[#1ed760] text-black'
                        : 'text-[#b3b3b3] hover:text-white'
                      }`}
                  >
                    {tab.label}
                    {tab.value !== 'all' && (
                      <span className="ml-1 opacity-70">({counts[tab.value]})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Word List ── */}
            <VocabList
              words={words}
              onEdit={handleEditClick}
              onDelete={handleDeleteWord}
              onReview={handleReview}
              search={search}
              hskFilter={hskFilter}
              sort={sort}
              onSortChange={setSort}
            />
          </>
        )}
      </div>

      {/* ── Bulk Import Modal ── */}
      {showBulk && (
        <BulkImport
          onImport={handleBulkImport}
          onClose={() => setShowBulk(false)}
        />
      )}

      {/* ── Mobile FAB ── */}
      {!activeForm && (
        <button
          id="mobile-add-fab"
          onClick={openAddForm}
          className="lg:hidden fixed bottom-24 right-5 w-14 h-14 bg-[#1ed760] text-black rounded-full shadow-[0_4px_20px_rgba(30,215,96,0.4)]
            flex items-center justify-center active:scale-90 transition-all duration-150 z-40"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  )
}
