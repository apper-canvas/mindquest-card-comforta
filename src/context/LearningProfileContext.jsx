import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { calculateProficiencyScore, determineDifficultyLevel } from '../utils/adaptiveLearningUtils';
import { generateCertificate, saveCertificate } from '../utils/certificateUtils';
import { useAuth } from './AuthContext';
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
  },
  completedCourses: [],
  certificates: []
};

export function LearningProfileProvider({ children }) {
  const { currentUser } = useAuth() || { currentUser: null };
  const [learningProfile, setLearningProfile] = useState(() => {
    const savedProfile = localStorage.getItem('learningProfile');
    return savedProfile ? JSON.parse(savedProfile) : initialLearningProfile;
  });
  
  // Save learning profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learningProfile', JSON.stringify(learningProfile));
  }, [learningProfile]);

  /**
   * Mark a course as completed and generate a certificate
   * 
   * @param {Object} course - The course data
   * @returns {Object} The generated certificate data
   */
  const completeCourse = (course) => {
    if (!course) return null;
    
    // Check if course is already completed
    if (learningProfile.completedCourses.some(c => c.id === course.id)) {
      toast.info("You've already completed this course!");
      return null;
    }
    
    setLearningProfile(prevProfile => {
      // Mark course as completed
      const completedCourse = {
        ...course,
        completionDate: new Date().toISOString()
      };
      
      // Generate certificate data
      const certificateData = generateCertificate({
        course,
        user: currentUser,
        completionDate: new Date().toISOString(),
        id: `cert-${Date.now()}-${course.id}`
      });
      
      // Save the certificate and return updated profile
      saveCertificate(certificateData);
      
      return {
        ...prevProfile,
        completedCourses: [...prevProfile.completedCourses, completedCourse],
        certificates: [...prevProfile.certificates, certificateData]
      };
    });
    
    return true;
  };
  
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
      recordQuizAttempt,
      completeCourse
    }}>
      {children}
    </LearningProfileContext.Provider>
  );
}

export const useLearningProfile = () => useContext(LearningProfileContext);