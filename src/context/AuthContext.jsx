import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Mock implementation - in a real app, this would use Firebase or another auth provider
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for stored user on mount
  useEffect(() => {
    const user = localStorage.getItem('mindquest_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Mock user database - in a real app, this would be in Firebase
  // For demo purposes only - in production, passwords would never be stored like this
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('mindquest_users');
    return savedUsers ? JSON.parse(savedUsers) : [
      {
        uid: '1',
        email: 'demo@example.com',
        password: 'Password123',
        displayName: 'Demo User',
        photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff'
      }
    ];
  });

  // Save users to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mindquest_users', JSON.stringify(users));
  }, [users]);

  // Register a new user
  const register = async (email, password, displayName) => {
    setError('');
    try {
      // Check if user already exists
      if (users.some(user => user.email === email)) {
        throw new Error('Email already in use');
      }

      // Create a new user
      const newUser = {
        uid: Date.now().toString(),
        email,
        password, // In a real app, this would be hashed
        displayName,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`
      };

      // Add user to the database
      setUsers(prevUsers => [...prevUsers, newUser]);

      // Log in the new user
      setCurrentUser(newUser);
      localStorage.setItem('mindquest_user', JSON.stringify(newUser));
      toast.success('Account created successfully!');
      return newUser;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    setError('');
    try {
      // Find user
      const user = users.find(user => user.email === email && user.password === password);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Set current user
      setCurrentUser(user);
      localStorage.setItem('mindquest_user', JSON.stringify(user));
      toast.success('Logged in successfully!');
      return user;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('mindquest_user');
    toast.info('Logged out successfully');
  };

  // Reset password
  const resetPassword = async (email) => {
    setError('');
    try {
      // Check if user exists
      const user = users.find(user => user.email === email);
      if (!user) {
        throw new Error('No account found with this email');
      }

      // In a real app, this would send a password reset email
      toast.success('Password reset link sent to your email!');
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    }
  };

  const value = {
    currentUser, loading, error, register, login, logout, resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}