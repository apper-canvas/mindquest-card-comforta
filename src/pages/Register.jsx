import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/authUtils';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Get icons
  const MailIcon = getIcon('Mail');
  const LockIcon = getIcon('Lock');
  const UserIcon = getIcon('User');
  const EyeIcon = getIcon('Eye');
  const EyeOffIcon = getIcon('EyeOff');
  const LoaderIcon = getIcon('Loader');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/');
    } catch (error) {
      // Error is already handled in the register function
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
          <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange}
                  className={`form-input pl-10 ${errors.name ? 'border-red-500 dark:border-red-500' : ''}`} 
                  placeholder="John Doe" />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
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
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} 
                  value={formData.password} onChange={handleChange}
                  className={`form-input pl-10 ${errors.password ? 'border-red-500 dark:border-red-500' : ''}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-500">
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} 
                  value={formData.confirmPassword} onChange={handleChange}
                  className={`form-input pl-10 ${errors.confirmPassword ? 'border-red-500 dark:border-red-500' : ''}`} />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <button type="submit" className="btn btn-primary w-full flex items-center justify-center" disabled={isLoading}>
              {isLoading ? <><LoaderIcon className="w-5 h-5 mr-2 animate-spin" /> Creating account...</> : 'Register'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-surface-600 dark:text-surface-400">Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;