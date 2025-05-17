import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils'; 

const ForgotPassword = () => {
  // Initialize ApperUI password reset view
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    if (ApperUI && ApperUI.showResetPassword) {
      ApperUI.showResetPassword("#authentication");
    } else {
      console.error("ApperUI or showResetPassword method not available");
    }
  }, []);

  // Icons
  const ArrowLeftIcon = getIcon('ArrowLeft');

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
            <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Reset Password</h1>
            <p className="mt-2 text-surface-600 dark:text-surface-400">Enter your email to reset your password</p>
          </div>

          {/* ApperUI password reset container */}
          <div id="authentication" className="min-h-[300px]" />
          
          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-primary hover:text-primary-dark">
              <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;