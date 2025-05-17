import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

function CertificateCard({ certificate }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get icons
  const AwardIcon = getIcon('Award');
  const CalendarIcon = getIcon('Calendar');
  const BookOpenIcon = getIcon('BookOpen');
  const ClockIcon = getIcon('Clock');
  const EyeIcon = getIcon('Eye');
  const DownloadIcon = getIcon('Download');
  const ShareIcon = getIcon('Share2');
  
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would use the Web Share API
    toast.info('Sharing functionality would be implemented here!');
  };
  
  return (
    <Link 
      to={`/certificate/${certificate.id}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white dark:bg-surface-800 rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="p-6 relative">
          <div className="absolute top-4 right-4">
            <AwardIcon className="w-7 h-7 text-primary" />
          </div>
          
          <h3 className="font-bold text-xl mb-2 pr-8">{certificate.courseTitle}</h3>
          
          <div className="flex items-center gap-1 text-xs text-primary-dark dark:text-primary-light font-medium mb-4">
            <span className="px-2 py-1 bg-primary/10 rounded-full">
              {certificate.courseCategory}
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-surface-600 dark:text-surface-300 text-sm">
              <CalendarIcon className="w-4 h-4 text-surface-400" />
              <span>Issued: {certificate.formattedIssueDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-surface-600 dark:text-surface-300 text-sm">
              <BookOpenIcon className="w-4 h-4 text-surface-400" />
              <span>{certificate.modules} modules completed</span>
            </div>
            
            <div className="flex items-center gap-2 text-surface-600 dark:text-surface-300 text-sm">
              <ClockIcon className="w-4 h-4 text-surface-400" />
              <span>{certificate.hoursCompleted} hours of training</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-primary">
              <EyeIcon className="w-4 h-4" />
              View Certificate
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CertificateCard;