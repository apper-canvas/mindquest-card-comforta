/**
 * Service for handling quiz_attempt table operations
 */

/**
 * Record a new quiz attempt
 * @param {Object} quizData - The quiz data
 * @param {number} score - The score achieved
 * @param {number} totalQuestions - Total number of questions
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The created quiz attempt
 */
export const recordQuizAttempt = async (quizData, score, totalQuestions, userId) => {
  try {
    if (!quizData || !userId) {
      throw new Error('Quiz data and user ID are required');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const percentageScore = (score / totalQuestions) * 100;
    
    const attemptData = {
      Name: `${quizData.title} - Attempt`,
      quizId: quizData.id,
      quizTitle: quizData.title,
      subject: quizData.subject.toLowerCase(),
      score: score,
      totalQuestions: totalQuestions,
      percentageScore: percentageScore,
      timestamp: new Date().toISOString(),
      userId: userId
    };

    const params = {
      records: [attemptData]
    };

    const response = await apperClient.createRecord("quiz_attempt", params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to record quiz attempt');
  } catch (error) {
    console.error("Error recording quiz attempt:", error);
    throw error;
  }
};

/**
 * Get all quiz attempts for a user
 * @param {string} userId - The user ID
 * @param {string} subject - Optional subject filter
 * @returns {Promise<Array>} - The list of quiz attempts
 */
export const getUserQuizAttempts = async (userId, subject = null) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const whereConditions = [
      {
        fieldName: "userId",
        operator: "ExactMatch",
        values: [userId]
      }
    ];

    if (subject) {
      whereConditions.push({
        fieldName: "subject",
        operator: "ExactMatch",
        values: [subject]
      });
    }

    const params = {
      fields: ["Id", "Name", "quizId", "quizTitle", "subject", "score", "totalQuestions", "percentageScore", "timestamp", "userId"],
      where: whereConditions
    };

    const response = await apperClient.fetchRecords("quiz_attempt", params);
    
    return response && response.data ? response.data : [];
  } catch (error) {
    console.error("Error fetching user quiz attempts:", error);
    throw error;
  }
};

export default {
  recordQuizAttempt,
  getUserQuizAttempts
};