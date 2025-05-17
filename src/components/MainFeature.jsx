import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useLearningProfile } from '../context/LearningProfileContext';
import { analyzeQuizPerformance } from '../utils/adaptiveLearningUtils';

// Sample quiz data
const quizData = [
  {
    id: 1,
    subject: "Programming",
    title: "Basic Python Concepts",
    questions: [
      {
        id: 101,
        prompt: "What symbol is used for comments in Python?",
        topic: "syntax",
        options: ["//", "/*", "#", "<!-- -->"],
        correctAnswer: "#"
      },
      {
        id: 102,
        prompt: "Which of the following is NOT a valid Python data type?",
        topic: "data_types",
        options: ["int", "float", "character", "boolean"],
        correctAnswer: "character"
      },
      {
        id: 103,
        topic: "operators",
        prompt: "What will be the output of: print(2 ** 3)?",
        options: ["6", "8", "9", "Error"],
        correctAnswer: "8"
      }
    ]
  },
  {
    id: 2,
    subject: "Languages",
    title: "Spanish Vocabulary",
    questions: [
      {
        id: 201,
        prompt: "What is 'hello' in Spanish?",
        topic: "greetings",
        options: ["Bonjour", "Ciao", "Hola", "Hallo"],
        correctAnswer: "Hola"
      },
      {
        id: 202,
        prompt: "How do you say 'thank you' in Spanish?",
        topic: "common_phrases",
        options: ["Merci", "Gracias", "Danke", "Grazie"],
        correctAnswer: "Gracias"
      },
      {
        id: 203,
        prompt: "What does 'mañana' mean?",
        topic: "time_expressions",
        options: ["Today", "Yesterday", "Tomorrow", "Night"],
        correctAnswer: "Tomorrow"
      }
    ]
  },
  {
    id: 3,
    subject: "Mathematics",
    title: "Basic Algebra",
    questions: [
      {
        id: 301,
        prompt: "Solve for x: 2x + 5 = 15",
        topic: "linear_equations",
        options: ["5", "7.5", "10", "5.5"],
        correctAnswer: "5"
      },
      {
        id: 302,
        prompt: "What is the value of y in: 4y - 3 = 13?",
        topic: "linear_equations",
        options: ["3", "4", "5", "4.5"],
        correctAnswer: "4"
      },
      {
        id: 303,
        prompt: "If 3a = 18, what is the value of a?",
        topic: "algebraic_expressions",
        options: ["3", "6", "9", "5"],
        correctAnswer: "6"
      }
    ]
  }
];

function MainFeature() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [viewingResults, setViewingResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showAdaptiveContent, setShowAdaptiveContent] = useState(false);
  const [quizAnalysis, setQuizAnalysis] = useState(null);
  
  // Use ref to store quiz state values that shouldn't trigger re-renders
  const quizStateRef = useRef({ 
    quizStarted: false,
    quizCompleted: false,
    timeLeft: null,
    viewingResults: false,
    currentQuestionIndex: 0,
    selectedQuiz: null
  });
  
  // Get learning profile context
  const { learningProfile, recordQuizAttempt } = useLearningProfile();
  
  // Get icons as components
  const ArrowRightIcon = getIcon('ArrowRight');
  const CheckCircleIcon = getIcon('CheckCircle');
  const XCircleIcon = getIcon('XCircle');
  const RotateCcwIcon = getIcon('RotateCcw');
  const TimerIcon = getIcon('Timer');
  const TrophyIcon = getIcon('Trophy');
  const BrainIcon = getIcon('Brain');
  const ClipboardListIcon = getIcon('ClipboardList');
  const PenToolIcon = getIcon('PenTool');
  const TrendingUpIcon = getIcon('TrendingUp');
  const TargetIcon = getIcon('Target');
  const ZapIcon = getIcon('Zap');
  const BookIcon = getIcon('Book');
  
  // Start a quiz
  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setScore(0);
    setUserAnswers([]);
    setQuizStarted(true);
    setTimeLeft(60); // 60 seconds per question
    
    // Update ref values
    quizStateRef.current = {
      ...quizStateRef.current,
      quizStarted: true,
      quizCompleted: false,
      timeLeft: 60
    };
    setViewingResults(false);
  };
  
  // Check the answer and move to the next question
  const checkAnswerAndContinue = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer before continuing.");
      return;
    }
    
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setUserAnswers([...userAnswers, {
      questionId: currentQuestion.id,
      question: currentQuestion.prompt,
      topic: currentQuestion.topic || 'general',
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      subject: selectedQuiz.subject.toLowerCase(),
      isCorrect
    }]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      // Update ref values
      quizStateRef.current = {
        ...quizStateRef.current,
        currentQuestionIndex: currentQuestionIndex + 1
      };
      setTimeLeft(60); // Reset timer for next question
    } else {
      setQuizCompleted(true);
      
      // Record quiz attempt for adaptive learning
      recordQuizAttempt(
        selectedQuiz,
        [...userAnswers, { questionId: currentQuestion.id, question: currentQuestion.prompt, topic: currentQuestion.topic || 'general', userAnswer: selectedAnswer, correctAnswer: currentQuestion.correctAnswer, subject: selectedQuiz.subject.toLowerCase(), isCorrect }],
        isCorrect ? score + 1 : score, selectedQuiz.questions.length);
        
      // Update ref values
      quizStateRef.current = {
        ...quizStateRef.current,
        quizCompleted: true
      };
    }
  };
  
  // Timer effect
  useEffect(() => {
    let timer;
    
    // Update ref with current state values to avoid stale closures
    quizStateRef.current = {
      quizStarted,
      quizCompleted,
      timeLeft,
      viewingResults,
      currentQuestionIndex,
      selectedQuiz
    };
    
    if (quizStateRef.current.quizStarted && !quizStateRef.current.quizCompleted && quizStateRef.current.timeLeft > 0 && !quizStateRef.current.viewingResults) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (quizStateRef.current.timeLeft === 0) {
      // Time's up for current question
      toast.warning("Time's up! Moving to next question.");
      
      const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
      
      setUserAnswers([...userAnswers, {
        questionId: currentQuestion.id,
        question: currentQuestion.prompt,
        topic: currentQuestion.topic || 'general',
        userAnswer: selectedAnswer || "No answer",
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: false
      }]);
      
      if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(60); // Reset timer for next question
      } else {
        setQuizCompleted(true);
        
        // Record quiz attempt for adaptive learning even if time ran out
        recordQuizAttempt(selectedQuiz, 
          [...userAnswers, { questionId: currentQuestion.id, question: currentQuestion.prompt, topic: currentQuestion.topic || 'general', userAnswer: selectedAnswer || "No answer", correctAnswer: currentQuestion.correctAnswer, isCorrect: false, subject: selectedQuiz.subject.toLowerCase() }], score, selectedQuiz.questions.length);
          
        // Update ref
        quizStateRef.current.quizCompleted = true;
      }
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft]); // Only depend on timeLeft
  
  // Reset the quiz selection
  const resetQuiz = () => {
    setSelectedQuiz(null);
    setQuizStarted(false);
    
    // Update ref values
    quizStateRef.current = {
      ...quizStateRef.current,
      quizStarted: false,
      quizCompleted: false,
      timeLeft: null,
      selectedQuiz: null
    };
    setViewingResults(false);
  };
  
  // View results
  const viewResults = () => {
    setViewingResults(true);
    // Analyze quiz results to provide adaptive content recommendations
    const analysis = analyzeQuizPerformance(userAnswers);
    setQuizAnalysis(analysis);
    
    // Update ref
    quizStateRef.current.viewingResults = true;
  };
  
  // View adaptive learning recommendations
  const viewAdaptiveContent = () => {
    setShowAdaptiveContent(true);
    
    // Update ref
    quizStateRef.current.showAdaptiveContent = true;
  };
  
  // Component for quiz selection
  const QuizSelection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-primary/10 text-primary mb-4">
          <BrainIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Test Your Knowledge</h2>
        <p className="text-surface-600 dark:text-surface-300">
          Challenge yourself with quizzes on different subjects to track your learning progress
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizData.map((quiz) => (
          <motion.div
            key={quiz.id}
            whileHover={{ scale: 1.03 }}
            className="card p-6 flex flex-col"
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                {quiz.subject}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
            <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">
              {quiz.questions.length} questions to test your {quiz.subject.toLowerCase()} knowledge.
            </p>
            
            <div className="mt-auto">
              <button
                onClick={() => startQuiz(quiz)}
                className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Start Quiz <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
  
  // Component for quiz questions
  const QuizQuestion = () => {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    
    return (
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
            {selectedQuiz.subject}
          </span>
          <div className="flex items-center gap-2 text-surface-600 dark:text-surface-300">
            <TimerIcon className="w-4 h-4" />
            <span className={`font-mono ${timeLeft < 10 ? 'text-red-500 font-bold' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-sm text-surface-500 dark:text-surface-400 mb-1">
            Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
          </div>
          <h3 className="text-xl font-bold mb-4">{currentQuestion.prompt}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedAnswer === option 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                    : 'border-surface-200 dark:border-surface-700 hover:border-primary/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={resetQuiz}
            className="btn btn-outline"
          >
            Cancel
          </button>
          
          <button
            onClick={checkAnswerAndContinue}
            disabled={selectedAnswer === null}
            className={`btn ${
              selectedAnswer === null 
                ? 'bg-surface-300 dark:bg-surface-600 cursor-not-allowed' 
                : 'btn-primary'
            }`}
          >
            {currentQuestionIndex < selectedQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </motion.div>
    );
  };
  
  // Component for quiz results
  const QuizResults = () => {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    
    // Get current difficulty level from learning profile for this subject
    const currentDifficulty = learningProfile.subjects[selectedQuiz.subject.toLowerCase()]?.difficultyLevel || 'beginner';
    
    let resultMessage = "";
    let resultIcon = null;
    
    if (percentage >= 80) {
      resultMessage = "Excellent work! You've mastered this topic.";
      resultIcon = <TrophyIcon className="w-10 h-10 text-yellow-500" />;
    } else if (percentage >= 60) {
      resultMessage = "Good job! You're making solid progress.";
      resultIcon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
    } else {
      resultMessage = "Keep practicing! You're building your knowledge.";
      resultIcon = <PenToolIcon className="w-10 h-10 text-primary" />;
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {!viewingResults && !showAdaptiveContent ? 
        (
          <div className="card p-8 text-center">
            <div className="mb-6 flex justify-center">
              {resultIcon}
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
            
            <p className="text-surface-600 dark:text-surface-300 mb-6">{resultMessage}</p>
            
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    className="text-surface-200 dark:text-surface-700" 
                    strokeWidth="8" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50" 
                  />
                  <circle 
                    className="text-primary" 
                    strokeWidth="8" 
                    strokeDasharray={`${percentage * 2.51} 251.2`} 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{percentage}%</span>
                </div>
              </div>
            </div>
            
            <div className="text-lg mb-6">
              You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{selectedQuiz.questions.length}</span>
            </div>

            {/* Current Difficulty Level Indicator */}
            <div className="mb-6 p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
              <div className="text-sm text-surface-600 dark:text-surface-300 mb-2">Your current learning level:</div>
              <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <TargetIcon className="w-5 h-5" />
                <span className="capitalize">{currentDifficulty}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
              <button
                onClick={viewResults}
                className="btn btn-outline flex items-center justify-center gap-2"
              >
                <ClipboardListIcon className="w-4 h-4" /> View Detailed Results
              </button>
              
              <button
                onClick={viewAdaptiveContent}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <TrendingUpIcon className="w-4 h-4" /> View Personalized Path
              </button>
              
              <button
                onClick={resetQuiz}
                className="btn btn-secondary flex items-center justify-center gap-2"
              >
                <RotateCcwIcon className="w-4 h-4" /> Try Another Quiz
              </button>
            </div>
          </div>
        ) : 
        showAdaptiveContent ? 
        (
          <div className="card p-6">
              <div>
                <h3 className="text-xl font-bold">
                  {selectedQuiz.title} - Detailed Results</h3>
                <div className="text-surface-600 dark:text-surface-300">
                  Score: {score}/{selectedQuiz.questions.length}
                </div>
              </div>
              
              <div className="space-y-6">
                {userAnswers.map((answer, index) => (
                  <div key={index} className="border-b border-surface-200 dark:border-surface-700 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      {answer.isCorrect ? (
                        <CheckCircleIcon className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 mt-1 text-red-500 flex-shrink-0" />
                      )}
                        
                      <div className="flex-grow">
                        <div className="font-medium mb-2">Question {index + 1}: {answer.question}</div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-1">
                          <div className="text-sm">
                            <span className="text-surface-500 dark:text-surface-400">Your answer: </span>
                            <span className={answer.isCorrect ? "text-green-600 dark:text-green-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
                              {answer.userAnswer}
                            </span>
                          </div>
                          
                        {!answer.isCorrect && (
                          <div className="text-sm">
                            <span className="text-surface-500 dark:text-surface-400">Correct answer: </span>
                            <span className="text-green-600 dark:text-green-400 font-medium">{answer.correctAnswer}</span>
                          </div>
                          )}
                          {!answer.isCorrect && (
                            <div className="mt-2 text-sm bg-surface-100 dark:bg-surface-800 p-2 rounded">
                              <span className="font-medium">Learning Recommendation: </span>
                              <Link 
                                to={`/course/${selectedQuiz.id === 1 ? 1 : selectedQuiz.id === 2 ? 2 : 3}`}
                                className="text-primary hover:underline flex items-center gap-1 mt-1"
                              >
                                <BookIcon className="w-4 h-4" /> View related learning materials
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={resetQuiz}
                    className="btn btn-outline flex items-center justify-center gap-2"
                  >
                    <RotateCcwIcon className="w-4 h-4" /> New Quiz
                  </button>
                  <Link
                    to={`/course/${selectedQuiz.id === 1 ? 1 : selectedQuiz.id === 2 ? 2 : 3}`}
                    className="btn btn-primary flex items-center justify-center gap-2"
                  >
                    <BookIcon className="w-4 h-4" /> Study Materials
                  </Link>
                </div>
              </div>
            </div>
        ) : 
        (
          <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5 text-primary" />
                  Your Adaptive Learning Path
                </h3>
                <div className="text-surface-600 dark:text-surface-300 text-sm">
                  Based on quiz performance
                </div>
              </div>
              
              {/* Proficiency Status */}
              <div className="mb-6 p-4 bg-surface-100 dark:bg-surface-800 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-surface-500 mb-1">Subject</div>
                    <div className="font-medium capitalize">{selectedQuiz.subject}</div>
                  </div>
                  <div>
                    <div className="text-xs text-surface-500 mb-1">Current Level</div>
                    <div className="font-medium capitalize">{currentDifficulty}</div>
                  </div>
                  <div>
                    <div className="text-xs text-surface-500 mb-1">Proficiency Score</div>
                    <div className="font-medium">{learningProfile.subjects[selectedQuiz.subject.toLowerCase()]?.proficiencyScore.toFixed(1) || 0}%</div>
                  </div>
                </div>
                
                {/* Performance Analysis */}
                <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mt-4">
                  <div className="text-sm mb-2">Based on your quiz results, we've adjusted your learning path:</div>
                  <ul className="text-sm list-disc list-inside space-y-1 pl-2">
                    {userAnswers.length > 0 && userAnswers.some(a => !a.isCorrect) && (
                      <li>We'll provide more practice on topics you found challenging</li>
                    )}
                    {percentage >= 70 && (
                      <li>Your content difficulty has been adjusted to match your skills</li>
                    )}
                    <li>Your next recommended quizzes and courses will adapt to your strengths and weaknesses</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowAdaptiveContent(false);
                    quizStateRef.current.showAdaptiveContent = false;
                  }} 
                  className="btn btn-outline flex items-center justify-center gap-2">
                    <RotateCcwIcon className="w-4 h-4" /> Back to Results
                  </button>
                  <Link to={`/course/${selectedQuiz.id === 1 ? 1 : selectedQuiz.id === 2 ? 2 : 3}`}
                    className="btn btn-primary flex items-center justify-center gap-2">
                    <BookIcon className="w-4 h-4" /> View Learning Materials
                  </Link>
              </div>
            </div>
          )}
        </motion.div>
    );
  };
  
  // Render the appropriate component based on the quiz state
  return (
    <div>
      {!quizStarted && <QuizSelection />}
      {quizStarted && !quizCompleted && <QuizQuestion />}
      {quizCompleted && <QuizResults />}      
    </div>
  );
}

export default MainFeature;