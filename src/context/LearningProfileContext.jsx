import { createContext, useContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { calculateProficiencyScore, determineDifficultyLevel } from '../utils/adaptiveLearningUtils';
import { recordQuizAttempt } from '../services/QuizAttemptService';
import { getOrCreateLearningProfile } from '../services/LearningProfileService';
import { markCourseCompleted } from '../services/CompletedCourseService';
import { generateCertificate } from '../services/CertificateService';
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
  contentProgress: {},
  completedCourses: [],
  certificates: []
};

export function LearningProfileProvider({ children }) {
  const userState = useSelector((state) => state.user);
  const currentUser = userState?.user;
  const isAuthenticated = userState?.isAuthenticated;
  
  const [learningProfile, setLearningProfile] = useState(() => {
    // Initialize with default values
    return initialLearningProfile;
  });
  
  // Load learning profile from database when user is authenticated
  useEffect(() => {
    const fetchLearningProfile = async () => {
      if (!isAuthenticated || !currentUser) return;
      
      try {
        const subjects = {};
        
        // For each subject, get or create profile
        for (const subject of ['programming', 'languages', 'mathematics']) {
          const profile = await getOrCreateLearningProfile(currentUser.userId, subject);
          subjects[subject] = {
            proficiencyScore: profile.proficiencyScore || 0,
            difficultyLevel: profile.difficultyLevel || 'beginner',
            quizAttempts: [], // To be loaded separately
            topics: {}
          };
        }
        
        setLearningProfile(prev => ({
          ...prev,
          subjects,
          lastActivity: new Date().toISOString(),
          preferences: {
            learningPace: 'moderate',
            showRecommendations: true
          }
        }));
      } catch (error) {
        console.error("Error loading learning profile:", error);
        toast.error("Failed to load learning profile");
      }
    };
    
    fetchLearningProfile();
  }, [isAuthenticated, currentUser]);

  /**
   * Mark a course as completed and generate a certificate
   * 
   * @param {Object} course - The course data
   * @returns {Object} The generated certificate data
   */
  const completeCourse = (course) => {
    return async (course) => {
      if (!course) return null;
    
      // Validate user exists before proceeding
      if (!isAuthenticated || !currentUser) {
        toast.error("You must be logged in to complete a course");
        return null;
      }
    
      try {
        // Mark course as completed in database
        await markCourseCompleted(course.Id, currentUser.userId);
    
        // Generate certificate
        const certificateData = await generateCertificate({
          course,
          user: currentUser
        });
    
        toast.success("Course completed and certificate generated!");
        return certificateData;
      } catch (error) {
        console.error("Error completing course:", error);
        toast.error("Failed to complete course: " + error.message);
        return null;
      }
    };
  };
  
  /**
   * Update content progress for a specific course
   */
  const updateContentProgress = async (courseId, progress) => {
    if (!courseId) return false;
    
    setLearningProfile(prev => ({
      ...prev,
      contentProgress: {
        ...prev.contentProgress,
        [courseId]: progress
      }
    }));
    
    return true;
  };
  
  /**
   * Record a completed quiz and update the learning profile
   * 
   * @param {Object} quizData - The quiz data including subject and title
   * @param {Array} userAnswers - Array of user's answers with correctness information
   * @param {Number} totalQuestions - Total number of questions
   */
  const recordQuizAttemptInProfile = async (quizData, userAnswers, score, totalQuestions) => {
    if (!quizData || !userAnswers) return;
    
    if (!isAuthenticated || !currentUser) {
      toast.error("You must be logged in to record quiz attempt");
      return;
    }

    try {
      // Record quiz attempt in database
      await recordQuizAttempt(quizData, score, totalQuestions, currentUser.userId);
      toast.success("Quiz attempt recorded successfully!");
    } catch (error) {
      console.error("Error recording quiz attempt:", error);
      toast.error("Failed to record quiz attempt");
    }
  };
  
  return (
    <LearningProfileContext.Provider value={{ 
      learningProfile, 
      recordQuizAttempt: recordQuizAttemptInProfile,
      completeCourse,
      updateContentProgress
    }}>
      {children}
    </LearningProfileContext.Provider>
  );
}

export const useLearningProfile = () => useContext(LearningProfileContext);