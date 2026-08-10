import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import BookPage from "./pages/BookPage";
import BookDetails from "./pages/BookDetails";
import LibraryPage from "./pages/LibraryPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

const RootRedirect = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') return <Navigate to="/dashboard" replace />;
    } catch {
      // ignore
    }
  }
  return <Navigate to="/user/dashboard" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
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
          path="/library"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/books"
          element={
            <ProtectedRoute adminOnly={true}>
              <BookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-book"
          element={
            <ProtectedRoute adminOnly={true}>
              <BookPage openAddModal={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/want-to-read"
          element={
            <ProtectedRoute adminOnly={true}>
              <BookPage defaultFilter="want" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading"
          element={
            <ProtectedRoute adminOnly={true}>
              <BookPage defaultFilter="reading" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finished"
          element={
            <ProtectedRoute adminOnly={true}>
              <BookPage defaultFilter="finished" />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
