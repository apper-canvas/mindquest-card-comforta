import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

function NotFound() {
  // Get icons as components
  const HomeIcon = getIcon('Home');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400">
            <AlertTriangleIcon className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-lg text-surface-600 dark:text-surface-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 btn btn-primary px-6 py-3"
        >
          <HomeIcon className="w-5 h-5" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;