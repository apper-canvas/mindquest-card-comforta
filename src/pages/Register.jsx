import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { motion } from 'framer-motion';

function Register() {
  const { isAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
    // Initialize ApperUI signup view when component mounts
    const { ApperUI } = window.ApperSDK;
    if (ApperUI) {
      ApperUI.showSignup("#authentication");
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto"
      >
        <div className="card p-6 md:p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Create Account</h1>
            <p className="mt-2 text-surface-600 dark:text-surface-400">Sign up for your account</p>
          </div>

          {/* ApperUI authentication container */}
          <div id="authentication" className="min-h-[400px]" />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;