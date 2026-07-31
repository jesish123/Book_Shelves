import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import BookPage from "./pages/BookPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-book"
          element={
            <ProtectedRoute>
              <BookPage openAddModal={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/want-to-read"
          element={
            <ProtectedRoute>
              <BookPage defaultFilter="want" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading"
          element={
            <ProtectedRoute>
              <BookPage defaultFilter="reading" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finished"
          element={
            <ProtectedRoute>
              <BookPage defaultFilter="finished" />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;