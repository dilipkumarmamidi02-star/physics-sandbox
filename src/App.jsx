import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/lib/AuthContext';
import { pagesConfig } from './pages.config'

import Home from './pages/Home'
import Laboratory from './pages/Laboratory'
import Simulator from './pages/Simulator'
import Learn from './pages/Learn'
import About from './pages/About'
import Profile from './pages/Profile'
import Progress from './pages/Progress'
import AdminDashboard from './pages/AdminDashboard'
import StudentAssignments from './pages/StudentAssignments'
import TeacherDashboard from './pages/TeacherDashboard'
import TemplateBuilder from './pages/TemplateBuilder'
import RoleSelect from './pages/RoleSelect'
import ConnectTeacher from './pages/ConnectTeacher'
import Layout from './Layout'

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
            <Route path="/Home" element={<Layout currentPageName="Home"><Home /></Layout>} />
            <Route path="/Laboratory" element={<Layout currentPageName="Laboratory"><Laboratory /></Layout>} />
            <Route path="/Simulator" element={<Layout currentPageName="Simulator"><Simulator /></Layout>} />
            <Route path="/Learn" element={<Layout currentPageName="Learn"><Learn /></Layout>} />
            <Route path="/About" element={<Layout currentPageName="About"><About /></Layout>} />
            <Route path="/Profile" element={<Layout currentPageName="Profile"><Profile /></Layout>} />
            <Route path="/Progress" element={<Layout currentPageName="Progress"><Progress /></Layout>} />
            <Route path="/AdminDashboard" element={<Layout currentPageName="AdminDashboard"><AdminDashboard /></Layout>} />
            <Route path="/StudentAssignments" element={<Layout currentPageName="StudentAssignments"><StudentAssignments /></Layout>} />
            <Route path="/TeacherDashboard" element={<Layout currentPageName="TeacherDashboard"><TeacherDashboard /></Layout>} />
            <Route path="/TemplateBuilder" element={<Layout currentPageName="TemplateBuilder"><TemplateBuilder /></Layout>} />
            <Route path="/RoleSelect" element={<Layout currentPageName="RoleSelect"><RoleSelect /></Layout>} />
            <Route path="/ConnectTeacher" element={<Layout currentPageName="ConnectTeacher"><ConnectTeacher /></Layout>} />
            <Route path="*" element={<Layout currentPageName="Home"><Home /></Layout>} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
