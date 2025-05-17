import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/authUtils';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useAuth();

  // Get icons
  const MailIcon = getIcon('Mail');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const LoaderIcon = getIcon('Loader');
  const CheckCircleIcon = getIcon('CheckCircle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setMessage('Check your email for instructions to reset your password');
    } catch (error) {
      // Error is already handled in the resetPassword function
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
          <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
          
          {message ? (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <p>{message}</p>
            </div>
          ) : (
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                  className={`form-input pl-10 ${error ? 'border-red-500 dark:border-red-500' : ''}`} 
                  placeholder="your@email.com" />
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            
            <button type="submit" className="btn btn-primary w-full flex items-center justify-center" disabled={isLoading}>
              {isLoading ? <><LoaderIcon className="w-5 h-5 mr-2 animate-spin" /> Sending reset link...</> : 'Reset Password'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;