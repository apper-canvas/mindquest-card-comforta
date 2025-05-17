/**
 * Adaptive Learning Utility Functions
 * This module contains algorithms and helper functions for implementing
 * adaptive learning capabilities in the application.
 */

// Define difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Mapping of proficiency scores to difficulty levels
const PROFICIENCY_THRESHOLDS = {
  0: DIFFICULTY_LEVELS.BEGINNER,    // 0-20% proficiency
  20: DIFFICULTY_LEVELS.BASIC,      // 20-40% proficiency
  40: DIFFICULTY_LEVELS.INTERMEDIATE, // 40-60% proficiency
  60: DIFFICULTY_LEVELS.ADVANCED,   // 60-80% proficiency
  80: DIFFICULTY_LEVELS.EXPERT      // 80-100% proficiency
};

/**
 * Calculate proficiency score based on quiz performance
 * Uses a weighted algorithm that gives more importance to recent performance
 * 
 * @param {Array} quizAttempts - Array of previous quiz attempts with scores
 * @param {Object} latestAttempt - Latest quiz attempt data
 * @returns {Number} Proficiency score (0-100)
 */
export function calculateProficiencyScore(quizAttempts = [], latestAttempt) {
  if (!quizAttempts.length && !latestAttempt) return 0;
  
  // If this is the first attempt, use only the latest score
  if (!quizAttempts.length && latestAttempt) {
    return latestAttempt.percentageScore;
  }
  
  // Combine previous attempts with latest attempt
  const allAttempts = latestAttempt 
    ? [...quizAttempts, latestAttempt] 
    : [...quizAttempts];
  
  // Calculate weighted average (more recent attempts have higher weight)
  let totalWeight = 0;
  let weightedSum = 0;
  
  allAttempts.forEach((attempt, index) => {
    // Weight increases with recency (more recent = higher weight)
    const weight = index + 1;
    totalWeight += weight;
    weightedSum += attempt.percentageScore * weight;
  });
  
  return weightedSum / totalWeight;
}

/**
 * Determine appropriate difficulty level based on proficiency score
 * 
 * @param {Number} proficiencyScore - User's proficiency score (0-100)
 * @returns {String} Recommended difficulty level
 */
export function determineDifficultyLevel(proficiencyScore) {
  // Default to beginner if no score is provided
  if (proficiencyScore === undefined || proficiencyScore === null) {
    return DIFFICULTY_LEVELS.BEGINNER;
  }
  
  // Find the appropriate difficulty level based on thresholds
  const thresholds = Object.keys(PROFICIENCY_THRESHOLDS)
    .map(Number)
    .sort((a, b) => a - b);
  
  // Find the highest threshold that the proficiency score exceeds
  let appropriateThreshold = thresholds[0];
  for (const threshold of thresholds) {
    if (proficiencyScore >= threshold) {
      appropriateThreshold = threshold;
    } else {
      break;
    }
  }
  
  return PROFICIENCY_THRESHOLDS[appropriateThreshold];
}

/**
 * Analyze quiz results to identify strengths and weaknesses
 * 
 * @param {Array} quizAnswers - Array of user's quiz answers with correctness
 * @returns {Object} Analysis of strengths and weaknesses
 */
export function analyzeQuizPerformance(quizAnswers) {
  if (!quizAnswers || !quizAnswers.length) {
    return { strengths: [], weaknesses: [] };
  }
  
  // Group answers by question type or topic (simplified example)
  const topicResults = quizAnswers.reduce((acc, answer) => {
    const topic = answer.topic || 'general';
    if (!acc[topic]) acc[topic] = { correct: 0, total: 0 };
    acc[topic].total += 1;
    if (answer.isCorrect) acc[topic].correct += 1;
    return acc;
  }, {});
  
  const strengths = Object.entries(topicResults).filter(([_, data]) => data.correct / data.total >= 0.7).map(([topic]) => topic);
  const weaknesses = Object.entries(topicResults).filter(([_, data]) => data.correct / data.total < 0.5).map(([topic]) => topic);
  
  return { strengths, weaknesses, topicResults };
}