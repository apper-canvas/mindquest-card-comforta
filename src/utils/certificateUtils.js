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
  if (!course) {
    throw new Error('Missing required parameter: course');
  }
  if (!user) {
    throw new Error('Missing required parameter: user');
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