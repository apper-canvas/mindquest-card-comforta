import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

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
        options: ["//", "/*", "#", "<!-- -->"],
        correctAnswer: "#"
      },
      {
        id: 102,
        prompt: "Which of the following is NOT a valid Python data type?",
        options: ["int", "float", "character", "boolean"],
        correctAnswer: "character"
      },
      {
        id: 103,
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
        options: ["Bonjour", "Ciao", "Hola", "Hallo"],
        correctAnswer: "Hola"
      },
      {
        id: 202,
        prompt: "How do you say 'thank you' in Spanish?",
        options: ["Merci", "Gracias", "Danke", "Grazie"],
        correctAnswer: "Gracias"
      },
      {
        id: 203,
        prompt: "What does 'mañana' mean?",
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
        options: ["5", "7.5", "10", "5.5"],
        correctAnswer: "5"
      },
      {
        id: 302,
        prompt: "What is the value of y in: 4y - 3 = 13?",
        options: ["3", "4", "5", "4.5"],
        correctAnswer: "4"
      },
      {
        id: 303,
        prompt: "If 3a = 18, what is the value of a?",
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
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(60); // Reset timer for next question
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && !quizCompleted && timeLeft > 0 && !viewingResults) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time's up for current question
      toast.warning("Time's up! Moving to next question.");
      
      const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
      
      setUserAnswers([...userAnswers, {
        questionId: currentQuestion.id,
        question: currentQuestion.prompt,
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
      }
    }
    
    return () => clearTimeout(timer);
  }, [quizStarted, quizCompleted, timeLeft, viewingResults, currentQuestionIndex, selectedQuiz, selectedAnswer, userAnswers]);
  
  // Reset the quiz selection
  const resetQuiz = () => {
    setSelectedQuiz(null);
    setQuizStarted(false);
    setViewingResults(false);
  };
  
  // View results
  const viewResults = () => {
    setViewingResults(true);
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
        {!viewingResults ? (
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={viewResults}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <ClipboardListIcon className="w-4 h-4" /> View Detailed Results
              </button>
              
              <button
                onClick={resetQuiz}
                className="btn btn-outline flex items-center justify-center gap-2"
              >
                <RotateCcwIcon className="w-4 h-4" /> Try Another Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{selectedQuiz.title} - Detailed Results</h3>
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
                    
                    <div>
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={resetQuiz}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <RotateCcwIcon className="w-4 h-4" /> Try Another Quiz
              </button>
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