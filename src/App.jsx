import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Navbar from "./components/Navbar"
import QuizPage from "./pages/QuizPage"
import Dashboard from "./pages/Dashboard"

export default function App() {
  return (
    <HashRouter>

      <div className="min-h-screen bg-black text-white">

        <Navbar />

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/quiz" />}
          />

          <Route
            path="/quiz"
            element={<QuizPage />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Routes>

      </div>

    </HashRouter>
  )
}
