import { NavLink } from 'react-router-dom'
import {
  BookOpen,
  Volume2,
  PenLine,
  GraduationCap,
  BarChart2,
  ClipboardList,
  Languages,
  Map,
  Sparkles,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/learn',    icon: Map,          label: 'Learning Path' },
  { to: '/studio',   icon: Sparkles,     label: 'Content Studio' },
  { to: '/pinyin',   icon: Languages,     label: 'Pinyin' },
  { to: '/vocab',    icon: BookOpen,      label: 'Vocabulary' },
  { to: '/listen',   icon: Volume2,       label: 'Listening' },
  { to: '/write',    icon: PenLine,       label: 'Writing' },
  { to: '/grammar',  icon: GraduationCap, label: 'Grammar' },
  { to: '/progress', icon: BarChart2,     label: 'Progress' },
  { to: '/exam',     icon: ClipboardList, label: 'Mock Exam' },
]

export default function Sidebar() {
  return (
    <nav className="flex flex-col h-full bg-[#121212] border-r border-[#4d4d4d]/40 px-3 py-6 w-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-9 h-9 rounded-full bg-[#1ed760] flex items-center justify-center shrink-0">
          <span className="text-black font-bold text-base leading-none">中</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Simple Chinese</p>
          <p className="text-[#b3b3b3] text-xs">HSK 1 – 3</p>
        </div>
      </div>

      {/* Navigation */}
      <ul className="space-y-1 flex-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? 'text-white bg-[#1f1f1f]'
                  : 'text-[#b3b3b3] hover:text-white hover:bg-[#1f1f1f]/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${isActive ? 'text-[#1ed760]' : 'text-current'}`}
                  />
                  <span>{label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1ed760]" />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer hint */}
      <div className="px-3 pt-4 border-t border-[#4d4d4d]/40">
        <p className="text-[#b3b3b3] text-xs leading-relaxed">
          Add words as you learn them.<br />Your pace, your vocabulary.
        </p>
      </div>
    </nav>
  )
}
