import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import BookManagement from './pages/BookManagement'
import EditBook from './pages/EditBook'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/books" element={<BookManagement />} />
      <Route path="/books/edit/:id" element={<EditBook />} />
    </Routes>
  )
}

export default App
