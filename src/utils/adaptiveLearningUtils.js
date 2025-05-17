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

/** Calculate proficiency score based on quiz performance */

/**
 * Generates a personalized learning path based on the learning profile
 * @param {Object} learningProfile - The user's learning profile
 * @param {string} subject - The subject for which to generate the path
 * @returns {Object} - The personalized learning path
 */
export function generateLearningPath(learningProfile, subject) {
  if (!learningProfile || !subject || !learningProfile.subjects[subject]) {
    return { milestones: [] };
  }

  const { proficiencyScore, difficultyLevel } = learningProfile.subjects[subject];
  const milestones = [];
  const totalMilestones = 5; // Fixed number of milestones for visualization
  
  // Calculate the number of completed milestones based on proficiency
  const completedMilestones = Math.floor((proficiencyScore / 100) * totalMilestones);
  
  // Basic course structure based on difficulty levels
  const courseStructure = {
    beginner: [
      { title: "Introduction to " + subject.charAt(0).toUpperCase() + subject.slice(1), description: "Learn the fundamentals and basic concepts", type: "course" },
      { title: "Basic " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Principles", description: "Build a solid foundation with core principles", type: "course" },
      { title: subject.charAt(0).toUpperCase() + subject.slice(1) + " Fundamentals Practice", description: "Reinforce your understanding with practice exercises", type: "practice" },
      { title: "Essential " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Techniques", description: "Learn common techniques and methodologies", type: "course" },
      { title: "Beginner " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Project", description: "Apply your knowledge in a guided project", type: "project" }
    ],
    intermediate: [
      { title: "Intermediate " + subject.charAt(0).toUpperCase() + subject.slice(1), description: "Expand your knowledge with more advanced concepts", type: "course" },
      { title: "Applied " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Techniques", description: "Practice applying techniques to solve problems", type: "practice" },
      { title: subject.charAt(0).toUpperCase() + subject.slice(1) + " Problem Solving", description: "Enhance your problem-solving skills with challenges", type: "challenge" },
      { title: "Specialized " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Topics", description: "Explore specialized areas within the field", type: "course" },
      { title: "Intermediate " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Project", description: "Build a more complex project with minimal guidance", type: "project" }
    ],
    advanced: [
      { title: "Advanced " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Concepts", description: "Master complex concepts and techniques", type: "course" },
      { title: "Expert " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Problem Solving", description: "Tackle advanced problems and scenarios", type: "challenge" },
      { title: "Cutting-edge " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Topics", description: "Explore the latest developments in the field", type: "course" },
      { title: "Advanced " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Research", description: "Conduct research on complex topics", type: "research" },
      { title: "Expert " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Project", description: "Demonstrate mastery through a complex project", type: "project" }
    ],
    expert: [
      { title: "Expert " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Mastery", description: "Refine your expertise in specific domains", type: "course" },
      { title: "Specialized " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Research", description: "Contribute to the field through original research", type: "research" },
      { title: "Innovation in " + subject.charAt(0).toUpperCase() + subject.slice(1), description: "Develop innovative solutions to complex problems", type: "challenge" },
      { title: "Leadership in " + subject.charAt(0).toUpperCase() + subject.slice(1), description: "Guide and mentor others in the field", type: "mentoring" },
      { title: "Mastery " + subject.charAt(0).toUpperCase() + subject.slice(1) + " Project", description: "Create an exemplary project demonstrating complete mastery", type: "project" }
    ]
  };
  
  // Select the appropriate path based on difficulty level
  const pathMilestones = courseStructure[difficultyLevel] || courseStructure.beginner;
  
  // Create milestones with completion status
  for (let i = 0; i < totalMilestones; i++) {
    milestones.push({
      ...pathMilestones[i],
      completed: i < completedMilestones,
      current: i === completedMilestones,
      unlocked: i <= completedMilestones
    });
  }
  
  return { milestones, progress: proficiencyScore, difficultyLevel };
}

/** Uses a weighted algorithm that gives more importance to recent performance
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