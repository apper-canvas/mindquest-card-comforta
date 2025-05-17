import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

function LearningMaterials() {
  const [activeTab, setActiveTab] = useState('courses');
  
  // Get icons as components
  const BookIcon = getIcon('Book');
  const VideoIcon = getIcon('Video');
  const FileTextIcon = getIcon('FileText');
  const ExternalLinkIcon = getIcon('ExternalLink');
  
  const tabItems = [
    { id: 'courses', label: 'Courses', icon: BookIcon },
    { id: 'videos', label: 'Video Tutorials', icon: VideoIcon },
    { id: 'resources', label: 'PDF Resources', icon: FileTextIcon },
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Learning Materials</h1>
        
        <div className="flex border-b border-surface-200 dark:border-surface-700 mb-6 overflow-x-auto">
          {tabItems.map((item) => (
            <button
              key={item.id}
              className={`px-4 py-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === item.id 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                <BookIcon className="w-16 h-16 text-primary" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Learning Resource {index + 1}</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">Helpful learning materials to enhance your knowledge and skills in various topics.</p>
                <Link to={`/course/${index + 1}`} className="btn btn-primary flex items-center gap-2 justify-center"><ExternalLinkIcon className="w-4 h-4" /> Access Content</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LearningMaterials;