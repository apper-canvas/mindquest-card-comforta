import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLearningProfile } from '../context/LearningProfileContext';
import { getIcon } from '../utils/iconUtils';

function LearningPathDisplay() {
  const { learningProfile } = useLearningProfile();
  const [activeSubject, setActiveSubject] = useState(Object.keys(learningProfile.subjects)[0]);
  
  // Icons
  const TrendingUpIcon = getIcon('TrendingUp');
  const AwardIcon = getIcon('Award');
  const BarChartIcon = getIcon('BarChart');
  const BookIcon = getIcon('Book');
  const GitBranchIcon = getIcon('GitBranch');
  const BrainIcon = getIcon('Brain');
  
  // Helper function to get a color based on proficiency score
  const getProficiencyColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-teal-500';
    if (score >= 40) return 'text-blue-500';
    if (score >= 20) return 'text-yellow-500';
    return 'text-orange-500';
  };
  
  // Helper function to get level name for display
  const getLevelName = (level) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };
  
  // Generate recommendations based on proficiency
  const getRecommendations = (subject, proficiencyScore) => {
    const recommendations = [];
    
    if (proficiencyScore < 30) {
      recommendations.push({
        type: 'course',
        title: `Fundamentals of ${subject}`,
        description: 'Master the basics with this introductory course',
        icon: 'BookOpen'
      });
    } else if (proficiencyScore < 60) {
      recommendations.push({
        type: 'practice',
        title: `${subject} Problem Solving`,
        description: 'Build your skills with these practice exercises',
        icon: 'Puzzle'
      });
    } else {
      recommendations.push({
        type: 'challenge',
        title: `Advanced ${subject} Concepts`,
        description: 'Test your expertise with challenging content',
        icon: 'Zap'
      });
    }
    
    return recommendations;
  };
  
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <GitBranchIcon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Your Adaptive Learning Path</h2>
      </div>
      
      {/* Subject Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-700 mb-6">
        {Object.keys(learningProfile.subjects).map((subject) => (
          <button
            key={subject}
            onClick={() => setActiveSubject(subject)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeSubject === subject
                ? 'border-primary text-primary'
                : 'border-transparent hover:border-surface-300 dark:hover:border-surface-600'
            }`}
          >
            {subject.charAt(0).toUpperCase() + subject.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Active Subject Content */}
      {activeSubject && learningProfile.subjects[activeSubject] && (
        <div>
          {/* Proficiency Overview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-surface-600 dark:text-surface-300">Current Proficiency</div>
              <div className={`text-sm font-medium ${getProficiencyColor(learningProfile.subjects[activeSubject].proficiencyScore)}`}>
                {getLevelName(learningProfile.subjects[activeSubject].difficultyLevel)}
              </div>
            </div>
            
            {/* Proficiency Bar */}
            <div className="h-2 w-full bg-surface-200 dark:bg-surface-700 rounded overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${learningProfile.subjects[activeSubject].proficiencyScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${getProficiencyColor(learningProfile.subjects[activeSubject].proficiencyScore)}`}
              />
            </div>
            
            <div className="text-xs text-surface-500 flex justify-between">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>
          
          {/* Learning History Summary */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="bg-surface-100 dark:bg-surface-800 p-3 rounded-lg text-center">
              <div className="text-surface-500 dark:text-surface-400 text-xs mb-1">Quizzes Completed</div>
              <div className="text-xl font-bold">
                {learningProfile.subjects[activeSubject].quizAttempts.length || 0}
              </div>
            </div>
            
            <div className="bg-surface-100 dark:bg-surface-800 p-3 rounded-lg text-center">
              <div className="text-surface-500 dark:text-surface-400 text-xs mb-1">Avg. Score</div>
              <div className="text-xl font-bold">
                {learningProfile.subjects[activeSubject].quizAttempts.length
                  ? Math.round(
                      learningProfile.subjects[activeSubject].quizAttempts.reduce(
                        (sum, attempt) => sum + attempt.percentageScore, 0
                      ) / learningProfile.subjects[activeSubject].quizAttempts.length
                    )
                  : 0}%
              </div>
            </div>
            
            <div className="bg-surface-100 dark:bg-surface-800 p-3 rounded-lg text-center">
              <div className="text-surface-500 dark:text-surface-400 text-xs mb-1">Current Level</div>
              <div className="text-xl font-bold capitalize">
                {learningProfile.subjects[activeSubject].difficultyLevel}
              </div>
            </div>
          </div>
          
          {/* Personalized Recommendations */}
          <div>
            <div className="text-sm font-medium mb-3 flex items-center gap-1">
              <BrainIcon className="h-4 w-4" />
              <span>Personalized Recommendations</span>
            </div>
            
            <div className="space-y-3">
              {getRecommendations(activeSubject, learningProfile.subjects[activeSubject].proficiencyScore).map((rec, index) => {
                const RecIcon = getIcon(rec.icon) || BookIcon;
                return (
                  <motion.div key={index} whileHover={{ x: 5 }} className="flex items-center gap-3 bg-surface-100 dark:bg-surface-800 p-3 rounded-lg cursor-pointer">
                    <RecIcon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{rec.title}</div>
                      <div className="text-xs text-surface-500 dark:text-surface-400">{rec.description}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningPathDisplay;