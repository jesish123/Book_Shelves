import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);

        // JWT 'exp' is in seconds; Date.now() is in milliseconds
        if (decoded.exp) {
            return Date.now() >= decoded.exp * 1000;
        }

        return false; // Token doesn't have an exp claim
    } catch (error) {

        return true;

    }
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        if (adminOnly && decoded.role !== 'admin') {
            return <Navigate to="/user/dashboard" replace />;
        }
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    if (children) {
        return children;
    }

    return <Outlet />;
};

export default ProtectedRoute;