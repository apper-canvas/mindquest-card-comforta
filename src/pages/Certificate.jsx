import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCertificateById, exportCertificateAsPdf } from '../utils/certificateUtils';
import { getIcon } from '../utils/iconUtils';
import { useAuth } from '../context/AuthContext';

function Certificate() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Get icons
  const DownloadIcon = getIcon('Download');
  const ShareIcon = getIcon('Share2');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const AwardIcon = getIcon('Award');
  
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
  
  const handleShare = () => {
    // In a real app, this would integrate with the Web Share API
    // or social media sharing functionality
    toast.info('Sharing functionality would be implemented here!');
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
    </div>
  );
}

export default Certificate;