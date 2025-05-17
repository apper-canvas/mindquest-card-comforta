/**
 * Service for handling certificate table operations
 */
import { format } from 'date-fns';

/**
 * Generate a new certificate
 * @param {Object} options - Certificate options
 * @param {Object} options.course - The completed course
 * @param {Object} options.user - The user who completed the course
 * @returns {Promise<Object>} - The created certificate
 */
export const generateCertificate = async (options) => {
  try {
    const { course, user } = options;
    if (!course || !user) {
      throw new Error('Course and user data are required');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const issueDate = new Date();
    const formattedDate = format(issueDate, 'MMMM d, yyyy');
    const certificateNumber = `MQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${course.Id}`;

    const certificateData = {
      Name: `${user.displayName} - ${course.title}`,
      courseId: course.Id,
      courseTitle: course.title,
      courseCategory: course.category,
      userName: user.displayName,
      userEmail: user.email,
      issueDate: issueDate.toISOString(),
      formattedIssueDate: formattedDate,
      certificateNumber: certificateNumber,
      hoursCompleted: course.duration ? parseInt(course.duration) : 0,
      modules: course.modules || 0
    };

    const params = {
      records: [certificateData]
    };

    const response = await apperClient.createRecord("certificate", params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to generate certificate');
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
};

/**
 * Get all certificates for a user
 * @param {string} userEmail - The user's email
 * @returns {Promise<Array>} - The list of certificates
 */
export const getUserCertificates = async (userEmail) => {
  try {
    if (!userEmail) throw new Error('User email is required');
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "courseId", "courseTitle", "courseCategory", "userName", "userEmail", "issueDate", "formattedIssueDate", "certificateNumber", "hoursCompleted", "modules"],
      where: [
        {
          fieldName: "userEmail",
          operator: "ExactMatch",
          values: [userEmail]
        }
      ]
    };

    const response = await apperClient.fetchRecords("certificate", params);
    
    if (response && response.data) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching certificates:", error);
    throw error;
  }
};

/**
 * Get a specific certificate by ID
 * @param {string} certificateId - The certificate ID
 * @returns {Promise<Object>} - The certificate data
 */
export const getCertificateById = async (certificateId) => {
  try {
    if (!certificateId) throw new Error('Certificate ID is required');
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById("certificate", certificateId);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching certificate:", error);
    throw error;
  }
};

export default {
  generateCertificate,
  getUserCertificates,
  getCertificateById
};