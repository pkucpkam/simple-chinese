import { useState } from 'react'
import { X, AlertCircle, CheckCircle2, Upload } from 'lucide-react'
import { generateId } from '../../data/data'

// Parse a single line: "汉字 | pinyin | meaning | HSK" or tab-separated
function parseLine(line) {
  const raw = line.trim()
  if (!raw) return null
  const parts = raw.split(/[|\t]/).map(p => p.trim())
  if (parts.length < 2) return null
  const [hanzi, pinyin, meaning, hskRaw] = parts
  if (!hanzi) return null
  const hsk = parseInt(hskRaw) || 1
  return {
    id: generateId(),
    hanzi,
    pinyin: pinyin || '',
    meaning: meaning || '',
    example: '',
    hsk: [1, 2, 3].includes(hsk) ? hsk : 1,
    createdAt: new Date().toISOString(),
  }
}

const PLACEHOLDER = `你好 | nǐ hǎo | Hello | 1
学习 | xué xí | To study | 1
朋友 | péng yǒu | Friend | 1
时间 | shí jiān | Time | 2
影响 | yǐng xiǎng | To influence | 3`

export default function BulkImport({ onImport, onClose }) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(null)

  function handleParse() {
    const lines = text.split('\n')
    const parsed = lines.map(parseLine).filter(Boolean)
    setPreview(parsed)
  }

  function handleImport() {
    if (!preview?.length) return
    onImport(preview)
    onClose()
  }

  const HSK_COLORS = { 1: 'text-[#1ed760]', 2: 'text-[#539df5]', 3: 'text-[#ffa42b]' }
  const HSK_BG = { 1: 'bg-[#1ed760]/10', 2: 'bg-[#539df5]/10', 3: 'bg-[#ffa42b]/10' }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        id="bulk-import-modal"
        className="bg-[#181818] border border-[#4d4d4d]/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#4d4d4d]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1ed760]/10 flex items-center justify-center">
              <Upload size={16} className="text-[#1ed760]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Bulk Import</h2>
              <p className="text-[#b3b3b3] text-xs">Paste a list — one word per line</p>
            </div>
          </div>
          <button
            id="bulk-import-close"
            onClick={onClose}
            className="text-[#b3b3b3] hover:text-white p-1.5 rounded-lg hover:bg-[#1f1f1f] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Format hint */}
          <div className="bg-[#1f1f1f] rounded-xl p-4 text-xs space-y-1.5">
            <p className="text-[#b3b3b3] font-medium mb-2">Format: <span className="text-white font-mono">Hanzi | Pinyin | Meaning | HSK</span></p>
            <div className="font-mono text-[#b3b3b3] space-y-0.5">
              <p><span className="text-white">你好</span> | nǐ hǎo | Hello | 1</p>
              <p><span className="text-white">学习</span> | xué xí | To study | 2</p>
            </div>
            <p className="text-[#4d4d4d] pt-1">Pinyin, Meaning, and HSK are optional — Hanzi is required.</p>
          </div>

          {/* Textarea */}
          <div>
            <label className="text-[#b3b3b3] text-xs font-medium uppercase tracking-wider block mb-2">
              Paste your list
            </label>
            <textarea
              id="bulk-import-textarea"
              rows={8}
              value={text}
              onChange={e => { setText(e.target.value); setPreview(null) }}
              placeholder={PLACEHOLDER}
              className="w-full bg-[#1f1f1f] text-white text-sm font-mono rounded-xl px-4 py-3 placeholder-[#4d4d4d]/60 resize-none
                border border-transparent focus:border-[#1ed760]/50 transition-colors leading-relaxed"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                {preview.length > 0
                  ? <CheckCircle2 size={16} className="text-[#1ed760]" />
                  : <AlertCircle size={16} className="text-[#f3727f]" />
                }
                <span className="text-sm font-medium text-white">
                  {preview.length > 0
                    ? `${preview.length} word${preview.length > 1 ? 's' : ''} ready to import`
                    : 'No valid words found'}
                </span>
              </div>
              {preview.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {preview.map((w, i) => (
                    <div key={w.id} className="flex items-center gap-3 bg-[#1f1f1f] rounded-xl px-4 py-2.5">
                      <span className="text-[#4d4d4d] text-xs w-5 shrink-0">{i + 1}</span>
                      <span className="text-white font-bold text-lg w-16 shrink-0">{w.hanzi}</span>
                      <span className="text-[#b3b3b3] text-xs flex-1 truncate">{w.pinyin} · {w.meaning}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${HSK_BG[w.hsk]} ${HSK_COLORS[w.hsk]}`}>
                        HSK {w.hsk}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#4d4d4d]/40 flex gap-3">
          {!preview ? (
            <>
              <button
                id="bulk-import-cancel"
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#1f1f1f] text-[#b3b3b3] hover:text-white font-semibold text-sm py-3 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                id="bulk-import-parse"
                type="button"
                onClick={handleParse}
                disabled={!text.trim()}
                className="flex-1 bg-[#1f1f1f] text-white font-bold text-sm py-3 rounded-full border border-[#4d4d4d] hover:border-[#1ed760]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Preview
              </button>
            </>
          ) : (
            <>
              <button
                id="bulk-import-back"
                type="button"
                onClick={() => setPreview(null)}
                className="flex-1 bg-[#1f1f1f] text-[#b3b3b3] hover:text-white font-semibold text-sm py-3 rounded-full transition-colors"
              >
                Edit
              </button>
              <button
                id="bulk-import-confirm"
                type="button"
                onClick={handleImport}
                disabled={preview.length === 0}
                className="flex-1 bg-[#1ed760] text-black font-bold text-sm py-3 rounded-full hover:bg-[#1fdf64] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all duration-150"
              >
                Import {preview.length} word{preview.length !== 1 ? 's' : ''}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
