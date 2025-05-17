import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/authUtils';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // Get icons
  const MailIcon = getIcon('Mail');
  const LockIcon = getIcon('Lock');
  const EyeIcon = getIcon('Eye');
  const EyeOffIcon = getIcon('EyeOff');
  const LoaderIcon = getIcon('Loader');

  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email';
    
    if (!password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is already handled in the login function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="card p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Login to MindQuest</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                  className={`form-input pl-10 ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`} 
                  placeholder="your@email.com" />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} 
                  className={`form-input pl-10 ${errors.password ? 'border-red-500 dark:border-red-500' : ''}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-500">
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="flex justify-between items-center">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            
            <button type="submit" className="btn btn-primary w-full flex items-center justify-center" disabled={isLoading}>
              {isLoading ? <><LoaderIcon className="w-5 h-5 mr-2 animate-spin" /> Logging in...</> : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-surface-600 dark:text-surface-400">Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;