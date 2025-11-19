import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import BookManagement from './pages/BookManagement'
import EditBook from './pages/EditBook'
import ManageUsers from './pages/ManageUsers'
import UserDetails from './pages/UserDetails'
import ManageSubscriptions from './pages/ManageSubscriptions'
import ManagePlans from './pages/ManagePlans'
import AddNewPlan from './pages/AddNewPlan'
import EditPlan from './pages/EditPlan'
import EditProfile from './pages/EditProfile'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/books" element={<Layout><BookManagement /></Layout>} />
        <Route path="/books/edit/:id" element={<Layout><EditBook /></Layout>} />
        <Route path="/users" element={<Layout><ManageUsers /></Layout>} />
        <Route path="/users/:id" element={<Layout><UserDetails /></Layout>} />
        <Route path="/subscriptions" element={<Layout><ManageSubscriptions /></Layout>} />
        <Route path="/plans" element={<Layout><ManagePlans /></Layout>} />
        <Route path="/plans/add" element={<Layout><AddNewPlan /></Layout>} />
        <Route path="/plans/edit/:planId" element={<Layout><EditPlan /></Layout>} />
        <Route path="/profile/edit" element={<Layout><EditProfile /></Layout>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
