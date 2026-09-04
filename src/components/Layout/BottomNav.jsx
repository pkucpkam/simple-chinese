import { NavLink } from 'react-router-dom'
import { BookOpen, Volume2, PenLine, GraduationCap, BarChart2, ClipboardList } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/vocab',    icon: BookOpen,      label: 'Vocab' },
  { to: '/listen',   icon: Volume2,       label: 'Listen' },
  { to: '/write',    icon: PenLine,       label: 'Write' },
  { to: '/grammar',  icon: GraduationCap, label: 'Grammar' },
  { to: '/progress', icon: BarChart2,     label: 'Progress' },
  { to: '/exam',     icon: ClipboardList, label: 'Exam' },
]

export default function BottomNav() {
  return (
    <nav className="bg-[#121212] border-t border-[#4d4d4d]/50 flex items-center justify-around px-2 py-2 safe-area-pb">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-150 min-w-[48px]
            ${isActive ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} className={isActive ? 'text-[#1ed760]' : 'text-current'} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
