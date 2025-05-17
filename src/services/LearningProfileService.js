/**
 * Service for handling learning_profile table operations
 */
import { calculateProficiencyScore, determineDifficultyLevel } from '../utils/adaptiveLearningUtils';

/**
 * Get or create a learning profile for a user and subject
 * @param {string} userId - The user ID
 * @param {string} subject - The subject
 * @returns {Promise<Object>} - The learning profile
 */
export const getOrCreateLearningProfile = async (userId, subject) => {
  try {
    if (!userId || !subject) {
      throw new Error('User ID and subject are required');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Try to find existing profile
    const params = {
      fields: ["Id", "Name", "subject", "proficiencyScore", "difficultyLevel", "lastActivity", "learningPace", "showRecommendations", "experiencePoints", "userId"],
      where: [
        {
          fieldName: "userId",
          operator: "ExactMatch",
          values: [userId]
        },
        {
          fieldName: "subject",
          operator: "ExactMatch",
          values: [subject]
        }
      ]
    };

    const response = await apperClient.fetchRecords("learning_profile", params);
    
    // If profile exists, return it
    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    // Otherwise create a new profile
    const newProfileData = {
      Name: `${subject} learning profile`,
      subject: subject,
      proficiencyScore: 0,
      difficultyLevel: 'beginner',
      lastActivity: new Date().toISOString(),
      learningPace: 'moderate',
      showRecommendations: true,
      experiencePoints: 0,
      userId: userId
    };

    const createParams = {
      records: [newProfileData]
    };

    const createResponse = await apperClient.createRecord("learning_profile", createParams);
    
    if (createResponse && createResponse.success && createResponse.results && createResponse.results[0] && createResponse.results[0].success) {
      return createResponse.results[0].data;
    }
    
    throw new Error('Failed to create learning profile');
  } catch (error) {
    console.error("Error in getOrCreateLearningProfile:", error);
    throw error;
  }
};

/**
 * Update learning profile after quiz attempt
 * @param {Object} profileId - The profile ID
 * @param {Object} attemptData - New quiz attempt data
 * @param {Array} previousAttempts - Previous quiz attempts
 * @returns {Promise<Object>} - The updated learning profile
 */
export const updateProfileAfterQuiz = async (profileId, attemptData, previousAttempts = []) => {
  try {
    if (!profileId || !attemptData) {
      throw new Error('Profile ID and attempt data are required');
    }

    // Calculate new proficiency score
    const proficiencyScore = calculateProficiencyScore(previousAttempts, attemptData);
    
    // Determine appropriate difficulty level
    const difficultyLevel = determineDifficultyLevel(proficiencyScore);
    
    // Update the profile in the database
    // Implementation would update the profile record with new scores
    
    return { proficiencyScore, difficultyLevel };
  } catch (error) {
    console.error("Error updating profile after quiz:", error);
    throw error;
  }
};

export default {
  getOrCreateLearningProfile,
  updateProfileAfterQuiz
};