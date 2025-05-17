import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { shareCertificate, generateShareUrl } from '../utils/certificateUtils';

function CertificateCard({ certificate }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Get icons
  const AwardIcon = getIcon('Award');
  const ExternalLinkIcon = getIcon('ExternalLink');
  const ShareIcon = getIcon('Share2');
  const CalendarIcon = getIcon('Calendar');
  const BookOpenIcon = getIcon('BookOpen');
  const ClockIcon = getIcon('Clock');
  const CloseIcon = getIcon('X');
  
  // Construct the certificate URL
  const certificateUrl = `${window.location.origin}/certificate/${certificate.id}`;
  
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Try to use Web Share API first
    const shared = await shareCertificate(
      certificate,
      certificateUrl,
      (message) => toast.success(message),
      (error) => toast.error(error)
    );
    
    // If Web Share API is not supported, show platform options
    if (!shared) {
      setShowShareOptions(true);
    }
  };
  
  const handlePlatformShare = (e, platform) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const shareUrl = generateShareUrl(platform, certificate, certificateUrl);
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opening ${platform} to share your certificate!`);
      setShowShareOptions(false);
    } catch (error) {
      toast.error(`Failed to share to ${platform}. Please try again.`);
    }
  };
  
  return (
    <Link to={`/certificate/${certificate.id}`} className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center text-primary">
            <AwardIcon className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium">{certificate.courseCategory}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleShare} 
              className="p-2 text-surface-500 hover:text-primary rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              aria-label="Share certificate"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h3 className="text-lg font-bold mb-3">{certificate.courseTitle}</h3>
        <p className="text-surface-500 dark:text-surface-400 text-sm mb-3">Issued on {certificate.formattedIssueDate}</p>
      </div>
    </Link>
  );
}

export default CertificateCard;