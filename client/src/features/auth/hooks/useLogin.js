import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { storage } from '../../../lib/storage';

/**
 * Custom hook to isolate login business logic, state management, and side effects.
 */
export function useLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Updates state based on input change events.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear errors as user types
  };

  /**
   * Validates credentials locally before calling services.
   * @returns {boolean} True if inputs are valid, false otherwise.
   */
  const validateForm = () => {
    if (!credentials.email.trim()) {
      toast.error('Email is required.');
      return false;
    }
    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (!credentials.password) {
      toast.error('Password is required.');
      return false;
    }
    if (credentials.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  /**
   * Handles form submission for user authentication.
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    const toastId = toast.loading('Authenticating...');

    try {
      const response = await authService.login(credentials);
      
      // Save credentials/token to storage
      // Expected backend response structure: { token, user: { name, email, role, ... } }
      const token = response.token || response.data?.token || 'dummy_token';
      const user = response.user || response.data?.user || { name: 'Assura Admin', email: credentials.email };
      
      storage.setAccessToken(token);
      storage.setUser(user);

      toast.success('Successfully logged in!', { id: toastId });
      
      // Navigate to dashboard after login
      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication Error:', err);
      const apiErrorMsg = err.response?.data?.message || err.message || 'Authentication failed. Please try again.';
      setError(apiErrorMsg);
      toast.error(apiErrorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
}

export default useLogin;
