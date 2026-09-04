import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/Layout/AppShell'
import VocabManager from './features/vocab/VocabManager'
import ListeningPractice from './features/listening/ListeningPractice'
import WritingPractice from './features/writing/WritingPractice'
import GrammarPractice from './features/grammar/GrammarPractice'
import ProgressDashboard from './features/progress/ProgressDashboard'
import MockExam from './features/exam/MockExam'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/vocab" replace />} />
          <Route path="vocab" element={<VocabManager />} />
          <Route path="listen" element={<ListeningPractice />} />
          <Route path="write" element={<WritingPractice />} />
          <Route path="grammar" element={<GrammarPractice />} />
          <Route path="progress" element={<ProgressDashboard />} />
          <Route path="exam" element={<MockExam />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
