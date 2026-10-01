import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { generateId } from '../../data/data'

const EMPTY_FORM = {
  hanzi: '',
  pinyin: '',
  meaning: '',
  example: '',
  hsk: 1,
}

export default function VocabForm({ onSave, onCancel, initialData = null }) {
  const isEditing = Boolean(initialData)
  const [form, setForm] = useState(isEditing ? initialData : EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(isEditing ? initialData : EMPTY_FORM)
  }, [initialData])

  function validate() {
    const e = {}
    if (!form.hanzi.trim()) e.hanzi = 'Hanzi is required'
    if (!form.meaning.trim()) e.meaning = 'Meaning is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(isEditing
      ? { ...form }
      : { ...form, id: generateId(), createdAt: new Date().toISOString() }
    )
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  return (
    <form
      id="vocab-form"
      onSubmit={handleSubmit}
      className="bg-[#181818] border border-[#4d4d4d]/40 rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white font-bold text-lg">
          {isEditing ? 'Edit Word' : 'Add New Word'}
        </h2>
        {onCancel && (
          <button
            type="button"
            id="vocab-form-close"
            onClick={onCancel}
            className="text-[#b3b3b3] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1f1f1f]"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Row 1: Hanzi + Pinyin */}
      <div className="grid grid-cols-2 gap-4">
        <Field
          id="field-hanzi"
          label="Hanzi *"
          value={form.hanzi}
          onChange={v => handleChange('hanzi', v)}
          placeholder="你好"
          error={errors.hanzi}
          inputClass="text-2xl font-bold tracking-wide"
        />
        <Field
          id="field-pinyin"
          label="Pinyin"
          value={form.pinyin}
          onChange={v => handleChange('pinyin', v)}
          placeholder="nǐ hǎo"
          hint="Tone marks optional"
        />
      </div>

      {/* Row 2: Meaning + HSK */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Field
            id="field-meaning"
            label="Meaning (English) *"
            value={form.meaning}
            onChange={v => handleChange('meaning', v)}
            placeholder="Hello / How are you"
            error={errors.meaning}
          />
        </div>
        {/* HSK Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#b3b3b3] text-xs font-medium uppercase tracking-wider">HSK Level</label>
          <div className="flex gap-1.5 h-10 items-center">
            {[1, 2, 3].map(lvl => (
              <button
                key={lvl}
                type="button"
                id={`hsk-btn-${lvl}`}
                onClick={() => handleChange('hsk', lvl)}
                className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all duration-150
                  ${form.hsk === lvl
                    ? 'bg-[#1ed760] text-black'
                    : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white hover:bg-[#252525]'
                  }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Example sentence */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[#b3b3b3] text-xs font-medium uppercase tracking-wider">Example Sentence</label>
        <textarea
          id="field-example"
          rows={2}
          value={form.example}
          onChange={e => handleChange('example', e.target.value)}
          placeholder="你好，我是小明。(Hello, I am Xiao Ming.)"
          className="w-full bg-[#1f1f1f] text-white text-sm rounded-xl px-4 py-3 placeholder-[#4d4d4d] resize-none
            border border-transparent focus:border-[#1ed760]/50 transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            id="vocab-form-cancel"
            onClick={onCancel}
            className="flex-1 bg-[#1f1f1f] text-[#b3b3b3] hover:text-white font-semibold text-sm py-3 rounded-full transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          id="vocab-form-submit"
          className="flex-1 bg-[#1ed760] text-black font-bold text-sm py-3 rounded-full hover:bg-[#1fdf64] active:scale-95 transition-all duration-150"
        >
          {isEditing ? 'Save Changes' : 'Add Word'}
        </button>
      </div>
    </form>
  )
}

function Field({ id, label, value, onChange, placeholder, error, hint, inputClass = '' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[#b3b3b3] text-xs font-medium uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#1f1f1f] text-white rounded-xl px-4 py-2.5 placeholder-[#4d4d4d] text-sm
          border ${error ? 'border-[#f3727f]/70' : 'border-transparent focus:border-[#1ed760]/50'}
          transition-colors ${inputClass}`}
      />
      {error && <p className="text-[#f3727f] text-xs">{error}</p>}
      {hint && !error && <p className="text-[#4d4d4d] text-xs">{hint}</p>}
    </div>
  )
}
