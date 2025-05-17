/**
 * Service for handling User3 table operations
 */

/**
 * Get the current user profile from the database
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The user profile data
 */
export const getUserProfile = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "displayName", "email", "bio", "location", "occupation", "interests", "photoURL", "preferences"],
      where: [
        {
          fieldName: "Id",
          operator: "ExactMatch",
          values: [userId]
        }
      ]
    };

    const response = await apperClient.fetchRecords("User3", params);
    
    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Update user profile in the database
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} - The updated user data
 */
export const updateUserProfile = async (userData) => {
  try {
    if (!userData || !userData.Id) throw new Error('User data with ID is required');
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const updateableData = {
      Id: userData.Id,
      Name: userData.Name,
      displayName: userData.displayName,
      email: userData.email,
      bio: userData.bio,
      location: userData.location,
      occupation: userData.occupation,
      interests: userData.interests,
      photoURL: userData.photoURL,
      preferences: userData.preferences
    };

    const params = {
      records: [updateableData]
    };

    const response = await apperClient.updateRecord("User3", params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to update user profile');
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Export all functions as a service object
export default {
  getUserProfile,
  updateUserProfile
};