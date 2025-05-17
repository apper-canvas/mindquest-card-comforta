import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCertificateById, exportCertificateAsPdf, shareCertificate, generateShareUrl } from '../utils/certificateUtils';
import { getIcon } from '../utils/iconUtils';
import { useAuth } from '../context/AuthContext';

function Certificate() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const certificateRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const certificateUrl = `${window.location.origin}${location.pathname}`;
  
  // Get icons
  const DownloadIcon = getIcon('Download');
  const ShareIcon = getIcon('Share2');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const AwardIcon = getIcon('Award');
  const CloseIcon = getIcon('X');
  
  useEffect(() => {
    // Load certificate data
    const certData = getCertificateById(id);
    
    if (certData) {
      setCertificate(certData);
    } else {
      toast.error('Certificate not found');
      navigate('/certificates');
    }
    
    setLoading(false);
  }, [id, navigate]);
  
  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      toast.info('Preparing your certificate for download...');
      await exportCertificateAsPdf(
        certificateRef.current, 
        `MindQuest_Certificate_${certificate.courseTitle.replace(/\s+/g, '_')}.pdf`
      );
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate. Please try again.');
    }
  };
  
  const handleShare = async () => {
    if (!certificate) return;
    
    // Try to use the Web Share API first
    const shared = await shareCertificate(
      certificate,
      certificateUrl,
      (message) => toast.success(message),
      (error) => toast.error(error)
    );
    
    // If Web Share API is not supported or fails, show our custom share dialog
    if (!shared) {
      setShowShareDialog(true);
    }
  };
  
  const handlePlatformShare = (platform) => {
    if (!certificate) return;
    
    try {
      const shareUrl = generateShareUrl(platform, certificate, certificateUrl);
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opening ${platform} to share your certificate!`);
      setShowShareDialog(false);
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      toast.error(`Failed to share to ${platform}. Please try again.`);
    }
    
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-lg">Loading certificate...</div>
      </div>
    );
  }
  
  if (!certificate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
          <p className="mb-4">The certificate you are looking for could not be found.</p>
          <Link to="/certificates" className="btn btn-primary">View All Certificates</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/certificates" className="flex items-center gap-2 text-primary hover:underline">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Certificates
        </Link>
        
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="btn btn-primary flex items-center gap-2"
          >
            <DownloadIcon className="w-4 h-4" />
            Download PDF
          </button>
          <button 
            onClick={handleShare}
            className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2"
          >
            <ShareIcon className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
      
      {/* Certificate Display */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-lg" ref={certificateRef}>
        <div className="p-10 text-center relative bg-[url('https://img.freepik.com/free-vector/abstract-classic-blue-certificate-template_23-2148573905.jpg?w=1380&t=st=1691328943~exp=1691329543~hmac=b0a0ede48ad4fe48a98a8eab28850af4e0df788c9fbe90af5a4758e59308c29d')] bg-cover bg-center">
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <AwardIcon className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-primary-dark">Certificate of Completion</h1>
            <p className="text-lg mb-8">This certifies that</p>
            <h2 className="text-3xl font-bold mb-4 text-secondary-dark">{certificate.userName}</h2>
            <p className="text-lg mb-8">has successfully completed the course</p>
            <h3 className="text-2xl font-bold mb-6 text-primary-dark">"{certificate.courseTitle}"</h3>
            <p className="text-md mb-2">with {certificate.modules} modules and {certificate.hoursCompleted} hours of training</p>
            <p className="text-md mb-8">Issued on {certificate.formattedIssueDate}</p>
            <p className="text-md font-semibold">Certificate ID: {certificate.certificateNumber}</p>
          </div>
        </div>
      </div>
      
      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Share Certificate</h3>
              <button 
                onClick={() => setShowShareDialog(false)}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-4 text-surface-600 dark:text-surface-300">
              Share your achievement with your network!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp', 'Telegram', 'Email'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => handlePlatformShare(platform)}
                  className="btn btn-outline flex items-center justify-center gap-2 py-3"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificate;