import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import BookManagement from './pages/BookManagement'
import EditBook from './pages/EditBook'
import ManageUsers from './pages/ManageUsers'
import UserDetails from './pages/UserDetails'
import ManageSubscriptions from './pages/ManageSubscriptions'
import ManagePlans from './pages/ManagePlans'
import AddNewPlan from './pages/AddNewPlan'
import EditProfile from './pages/EditProfile'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/books" element={<BookManagement />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/subscriptions" element={<ManageSubscriptions />} />
        <Route path="/plans" element={<ManagePlans />} />
        <Route path="/plans/add" element={<AddNewPlan />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
