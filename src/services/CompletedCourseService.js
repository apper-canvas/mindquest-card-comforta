/**
 * Service for handling completed_course table operations
 */

/**
 * Mark a course as completed
 * @param {string} courseId - The course ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The created completed course record
 */
export const markCourseCompleted = async (courseId, userId) => {
  try {
    if (!courseId || !userId) {
      throw new Error('Course ID and user ID are required');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Check if course is already completed
    const checkParams = {
      fields: ["Id"],
      where: [
        {
          fieldName: "courseId",
          operator: "ExactMatch",
          values: [courseId]
        },
        {
          fieldName: "userId",
          operator: "ExactMatch",
          values: [userId]
        }
      ]
    };

    const checkResponse = await apperClient.fetchRecords("completed_course", checkParams);
    
    if (checkResponse && checkResponse.data && checkResponse.data.length > 0) {
      // Course is already completed
      return checkResponse.data[0];
    }
    
    // Create a new completed course record
    const completedData = {
      Name: `Course completion ${courseId}`,
      completionDate: new Date().toISOString(),
      courseId: courseId,
      userId: userId
    };

    const params = {
      records: [completedData]
    };

    const response = await apperClient.createRecord("completed_course", params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to mark course as completed');
  } catch (error) {
    console.error("Error marking course as completed:", error);
    throw error;
  }
};

/**
 * Get all completed courses for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - The list of completed courses
 */
export const getUserCompletedCourses = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "completionDate", "courseId", "userId"],
      where: [{ fieldName: "userId", operator: "ExactMatch", values: [userId] }]
    };

    const response = await apperClient.fetchRecords("completed_course", params);
    
    return response && response.data ? response.data : [];
  } catch (error) {
    console.error("Error fetching completed courses:", error);
    throw error;
  }
};

export default {
  markCourseCompleted,
  getUserCompletedCourses
};