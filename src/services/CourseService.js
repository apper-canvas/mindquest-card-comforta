/**
 * Service for handling course1 table operations
 */

/**
 * Get all courses with optional filtering
 * @param {Object} options - Filter options
 * @param {string} options.category - Filter by category
 * @param {string} options.searchQuery - Search in title or description
 * @returns {Promise<Array>} - The list of courses
 */
export const getCourses = async (options = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const fields = [
      "Id", "Name", "title", "category", "level", "rating", 
      "enrolled", "image", "modules", "duration", "completed"
    ];

    // Build query parameters
    const params = { fields };
    const whereConditions = [];

    // Filter by category if provided and not 'all'
    if (options.category && options.category !== 'all') {
      whereConditions.push({
        fieldName: "category",
        operator: "ExactMatch",
        values: [options.category]
      });
    }

    // Search by query if provided
    if (options.searchQuery) {
      whereConditions.push({
        fieldName: "title",
        operator: "Contains",
        values: [options.searchQuery]
      });
    }

    if (whereConditions.length > 0) {
      params.where = whereConditions;
    }

    const response = await apperClient.fetchRecords("course1", params);
    
    if (response && response.data) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

/**
 * Get a course by ID
 * @param {string} courseId - The course ID
 * @returns {Promise<Object>} - The course data
 */
export const getCourseById = async (courseId) => {
  try {
    if (!courseId) throw new Error('Course ID is required');
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "title", "category", "level", "rating", "enrolled", "image", "modules", "duration", "completed"],
      where: [
        {
          fieldName: "Id",
          operator: "ExactMatch",
          values: [courseId]
        }
      ]
    };

    const response = await apperClient.fetchRecords("course1", params);
    
    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

export default {
  getCourses,
  getCourseById
};