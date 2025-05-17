/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if the email is valid
 */
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number" };
  }
  return { isValid: true, message: "Password is strong" };
};

/**
 * Validates profile data before update
 * @param {object} profileData - The profile data to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validateProfileData = (profileData) => {
  const errors = {};
  
  // Validate display name
  if (!profileData.displayName || profileData.displayName.trim() === '') {
    errors.displayName = 'Display name is required';
  } else if (profileData.displayName.length > 50) {
    errors.displayName = 'Display name cannot exceed 50 characters';
  }
  
  // Validate bio
  if (profileData.bio && profileData.bio.length > 500) {
    errors.bio = 'Bio cannot exceed 500 characters';
  }
  
  // Validate location
  if (profileData.location && profileData.location.length > 100) {
    errors.location = 'Location cannot exceed 100 characters';
  }
  
  // Validate occupation
  if (profileData.occupation && profileData.occupation.length > 100) {
    errors.occupation = 'Occupation cannot exceed 100 characters';
  }
  
  // Validate interests
  if (profileData.interests && profileData.interests.length > 200) {
    errors.interests = 'Interests cannot exceed 200 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Converts image file to base64 string for storage
 */
export const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});