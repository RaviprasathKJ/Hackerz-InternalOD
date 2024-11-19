// frontend/utils/auth.js
import { jwtDecode } from 'jwt-decode';

// for authentication
export const isAuthenticated = (navigate) => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp > currentTime) {
      return true;
    } else {
      navigate('/login');
      return false;
    }
  } catch (error) {
    navigate('/login');
    return false;
  }
};

export const getRole = (navigate) => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;
    return role;
  } catch (error) {
    navigate('/login');
    return null;
  }
};;