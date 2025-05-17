import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { calculateProficiencyScore, determineDifficultyLevel } from '../utils/adaptiveLearningUtils';

// Create context
const LearningProfileContext = createContext();

// Initial learning profile state
const initialLearningProfile = {
  subjects: {
    programming: {
      proficiencyScore: 0,
      difficultyLevel: 'beginner',
      quizAttempts: [],
      topics: {}
    },
    languages: {
      proficiencyScore: 0,
      difficultyLevel: 'beginner',
      quizAttempts: [],
      topics: {}
    },
    mathematics: {
      proficiencyScore: 0,
      difficultyLevel: 'beginner',
      quizAttempts: [],
      topics: {}
    }
  },
  lastActivity: null,
  preferences: {
    learningPace: 'moderate',
    showRecommendations: true
  }
};

export function LearningProfileProvider({ children }) {
  // Try to load learning profile from localStorage
  const [learningProfile, setLearningProfile] = useState(() => {
    const savedProfile = localStorage.getItem('learningProfile');
    return savedProfile ? JSON.parse(savedProfile) : initialLearningProfile;
  });
  
  // Save learning profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learningProfile', JSON.stringify(learningProfile));
  }, [learningProfile]);
  
  /**
   * Record a completed quiz and update the learning profile
   * 
   * @param {Object} quizData - The quiz data including subject and title
   * @param {Array} userAnswers - Array of user's answers with correctness information
   * @param {Number} score - Number of correct answers
   * @param {Number} totalQuestions - Total number of questions
   */
  const recordQuizAttempt = (quizData, userAnswers, score, totalQuestions) => {
    if (!quizData || !userAnswers) return;
    
    const subject = quizData.subject.toLowerCase();
    const attemptData = {
      quizId: quizData.id,
      quizTitle: quizData.title,
      score,
      totalQuestions,
      percentageScore: (score / totalQuestions) * 100,
      timestamp: new Date().toISOString(),
      answers: userAnswers
    };
    
    setLearningProfile(prevProfile => {
      // Make sure the subject exists in the profile
      if (!prevProfile.subjects[subject]) {
        prevProfile.subjects[subject] = {
          proficiencyScore: 0,
          difficultyLevel: 'beginner',
          quizAttempts: [],
          topics: {}
        };
      }
      
      // Add new quiz attempt to the subject
      const updatedAttempts = [...(prevProfile.subjects[subject].quizAttempts || []), attemptData];
      
      // Calculate new proficiency score based on all attempts
      const proficiencyScore = calculateProficiencyScore(
        prevProfile.subjects[subject].quizAttempts,
        attemptData
      );
      
      // Determine appropriate difficulty level
      const difficultyLevel = determineDifficultyLevel(proficiencyScore);
      
      // Check if difficulty level has changed
      const difficultyChanged = prevProfile.subjects[subject].difficultyLevel !== difficultyLevel;
      
      // If difficulty changed, notify the user
      if (difficultyChanged) {
        const action = difficultyLevel > prevProfile.subjects[subject].difficultyLevel ? 'increased' : 'adjusted';
        toast.info(`Your ${subject} content difficulty has been ${action} to ${difficultyLevel} based on your performance.`);
      }
      
      return {
        ...prevProfile,
        subjects: {
          ...prevProfile.subjects,
          [subject]: {
            ...prevProfile.subjects[subject],
            proficiencyScore,
            difficultyLevel,
            quizAttempts: updatedAttempts,
          }
        },
        lastActivity: new Date().toISOString()
      };
    });
  };
  
  return (
    <LearningProfileContext.Provider value={{ 
      learningProfile, 
      recordQuizAttempt 
    }}>
      {children}
    </LearningProfileContext.Provider>
  );
}

export const useLearningProfile = () => useContext(LearningProfileContext);