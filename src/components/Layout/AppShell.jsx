import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppShell() {
  return (
    <div className="flex h-full bg-[#121212]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50">
        <BottomNav />
      </div>
    </div>
  )
}
