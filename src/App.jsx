import {
  HashRouter,
  Routes,
  Route
} from 'react-router-dom'

import Dashboard
from './pages/Dashboard'

import QuizPage
from './pages/QuizPage'

export default function App() {

  return (

    <HashRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/quiz"
          element={<QuizPage />}
        />

      </Routes>

    </HashRouter>

  )
}
