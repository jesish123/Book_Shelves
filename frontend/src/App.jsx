import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import Dashboard from "./pages/Dashboard"
import BookPage from "./pages/BookPage"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App