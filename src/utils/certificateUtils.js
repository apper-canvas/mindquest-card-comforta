import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate certificate data for a completed course
 * 
 * @param {Object} options - Certificate options
 * @param {Object} options.course - The completed course
 * @param {Object} options.user - The user who completed the course
 * @param {String} options.completionDate - ISO date string of completion
 * @param {String} options.id - Unique identifier for the certificate
 * @returns {Object} Certificate data
 */
export function generateCertificate({ course, user, completionDate, id }) {
  // Validate all required parameters
  if (!course || typeof course !== 'object') {
    throw new Error('Missing or invalid required parameter: course');
  }
  
  if (!user || typeof user !== 'object') {
    throw new Error('Missing required parameter: user');
  }
  
  // Validate user has required properties
  if (!user.email) {
    throw new Error('Missing required user property: email');
  }
  
  if (!completionDate) {
    throw new Error('Missing required parameter: completionDate');
  }
  
  // Validate required course properties
  if (!course.id) {
    throw new Error('Missing required course property: id');
  }
  if (!course.title) {
    course.title = 'Unnamed Course'; // Fallback for missing title
  }
  if (!course.category) {
    course.category = 'General'; // Fallback for missing category
  }
  
  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return {
    id: id || `cert-${Date.now()}-${course.id}`,
    courseId: course.id,
    courseTitle: course.title,
    courseCategory: course.category,
    userName: user.displayName || user.email.split('@')[0],
    userEmail: user.email,
    issueDate: completionDate,
    formattedIssueDate: formattedDate,
    validUntil: null, // Certificates don't expire in this system
    certificateNumber: `MQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${course.id}`,
    hoursCompleted: course.duration ? course.duration.replace(/\D/g, '') : '0',
    modules: course.modules || 0
  };
}

/**
 * Save certificate to localStorage
 * 
 * @param {Object} certificateData - Certificate data to save
 * @returns {Boolean} Success status
 */
export function saveCertificate(certificateData) {
  if (!certificateData) return false;
  
  try {
    // Get existing certificates
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    
    // Add new certificate
    certificates.push(certificateData);
    
    // Save back to localStorage
    localStorage.setItem('certificates', JSON.stringify(certificates));
    
    return true;
  } catch (error) {
    console.error('Error saving certificate:', error);
    return false;
  }
}

/**
 * Get all certificates from localStorage
 * 
 * @returns {Array} Array of certificate data
 */
export function getAllCertificates() {
  try {
    return JSON.parse(localStorage.getItem('certificates') || '[]');
  } catch (error) {
    console.error('Error retrieving certificates:', error);
    return [];
  }
}

/**
 * Get a specific certificate by ID
 * 
 * @param {String} id - Certificate ID
 * @returns {Object|null} Certificate data or null if not found
 */
export function getCertificateById(id) {
  try {
    const certificates = getAllCertificates();
    return certificates.find(cert => cert.id === id) || null;
  } catch (error) {
    console.error('Error retrieving certificate:', error);
    return null;
  }
}

/**
 * Export certificate as PDF using HTML content
 * 
 * @param {HTMLElement} element - The HTML element to export
 * @param {String} filename - The filename for the PDF
 */
export async function exportCertificateAsPdf(element, filename = 'certificate.pdf') {
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
  pdf.addImage(imgData, 'PNG', 0, 0, 297, 210); // A4 size
  pdf.save(filename);
}

/**
 * Generate social share URL for various platforms
 * 
 * @param {String} platform - The social platform (facebook, twitter, linkedin, etc.)
 * @param {Object} certificate - Certificate data
 * @param {String} shareUrl - URL to share
 * @returns {String} The social share URL
 */
export function generateShareUrl(platform, certificate, shareUrl) {
  const text = `I earned a certificate in ${certificate.courseTitle} from MindQuest!`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);
  
  switch (platform.toLowerCase()) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case 'email':
      const subject = encodeURIComponent(`My MindQuest Certificate: ${certificate.courseTitle}`);
      const body = encodeURIComponent(`Hi,\n\nI'm excited to share that I earned a certificate in ${certificate.courseTitle} from MindQuest!\n\nView my certificate here: ${shareUrl}\n\nCertificate ID: ${certificate.certificateNumber}\nIssued on: ${certificate.formattedIssueDate}`);
      return `mailto:?subject=${subject}&body=${body}`;
    default:
      return shareUrl;
  }
}

/**
 * Generate text content for sharing certificate
 * 
 * @param {Object} certificate - The certificate data
 * @returns {String} Formatted text for sharing
 */
export function generateShareText(certificate) {
  return `I earned a certificate in ${certificate.courseTitle} from MindQuest! Issued on ${certificate.formattedIssueDate}. Certificate ID: ${certificate.certificateNumber}`;
}

/**
 * Share certificate using Web Share API or fallback methods
 * 
 * @param {Object} certificate - Certificate data
 * @param {String} certificateUrl - URL to the certificate
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 * @returns {Promise<boolean>} Success status
 */
export async function shareCertificate(certificate, certificateUrl, onSuccess, onError) {
  try {
    const shareData = {
      title: `MindQuest Certificate: ${certificate.courseTitle}`,
      text: generateShareText(certificate),
      url: certificateUrl
    };

    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      if (onSuccess) onSuccess('Certificate shared successfully!');
      return true;
    } else {
      // Web Share API not supported - fallback handled by UI
      return false;
    }
  } catch (error) {
    console.error('Error sharing certificate:', error);
    if (onError) onError('Failed to share certificate. Please try again.');
    return false;
  }
}