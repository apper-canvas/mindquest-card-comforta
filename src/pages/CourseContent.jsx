import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useLearningProfile } from '../context/LearningProfileContext';

// Sample course content data
const courseContentData = {
  1: {
    title: "Python for Beginners",
    category: "Programming",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        id: "intro",
        title: "Introduction to Python",
        content: {
          notes: [
            "Python is a high-level, interpreted programming language created by Guido van Rossum in 1991.",
            "Python's design philosophy emphasizes code readability with its notable use of significant whitespace.",
            "Python features a dynamic type system and automatic memory management.",
            "It supports multiple programming paradigms, including object-oriented, imperative, functional and procedural."
          ],
          theory: [
            {
              title: "Python Philosophy",
              content: "Python's philosophy is encapsulated in the document 'The Zen of Python', which includes aphorisms such as:\n• Beautiful is better than ugly.\n• Explicit is better than implicit.\n• Simple is better than complex.\n• Readability counts."
            },
            {
              title: "Interpreted Language",
              content: "Python is an interpreted language, meaning that code is executed line by line by the Python interpreter. This differs from compiled languages where code must first be translated into machine code."
            },
            {
              title: "Cross-Platform",
              content: "Python code can run on various operating systems including Windows, macOS, and Linux, making it highly portable."
            }
          ],
          examples: [
            {
              title: "Hello World",
              code: "print('Hello, World!')",
              explanation: "This simple example shows how to output text to the console in Python. The print() function displays the string 'Hello, World!' when executed."
            },
            {
              title: "Variables and Data Types",
              code: "# Integer\nage = 25\n\n# Float\nheight = 1.75\n\n# String\nname = 'John Doe'\n\n# Boolean\nis_student = True\n\n# List\nhobbies = ['reading', 'running', 'coding']\n\n# Dictionary\nperson = {\n    'name': 'John',\n    'age': 25,\n    'is_student': True\n}",
              explanation: "This example demonstrates various data types in Python, including integers, floats, strings, booleans, lists, and dictionaries."
            }
          ]
        }
      },
      {
        id: "basics",
        title: "Python Basics",
        content: {
          notes: [
            "Python syntax is designed to be intuitive and clean.",
            "Indentation is used to define code blocks, rather than curly braces.",
            "Variables are dynamically typed and don't need explicit declaration.",
            "Python includes built-in data types like lists, tuples, dictionaries, and sets."
          ],
          theory: [
            {
              title: "Variables and Types",
              content: "Variables in Python are created when a value is assigned to them. Python is dynamically-typed, meaning you don't need to declare the type of variable when creating it."
            },
            {
              title: "Control Flow",
              content: "Python uses if, elif, and else statements for conditional execution, and provides while and for loops for iteration. The for loop in Python iterates over elements of a sequence."
            },
            {
              title: "Functions",
              content: "Functions are defined using the def keyword. They can accept parameters and return values. Python supports both positional and keyword arguments."
            }
          ],
          examples: [
            {
              title: "If-Else Statement",
              code: "age = 18\n\nif age >= 18:\n    print('You are an adult')\nelse:\n    print('You are a minor')",
              explanation: "This example shows an if-else statement that checks if the age variable is greater than or equal to 18. If it is, it prints 'You are an adult', otherwise it prints 'You are a minor'."
            },
            {
              title: "For Loop",
              code: "fruits = ['apple', 'banana', 'cherry']\n\nfor fruit in fruits:\n    print(f'I like {fruit}')",
              explanation: "This example demonstrates a for loop that iterates over a list of fruits, printing a message for each one. The f-string is used for string formatting."
            },
            {
              title: "Function Definition",
              code: "def greet(name, greeting='Hello'):\n    return f'{greeting}, {name}!'\n\n# Function calls\nprint(greet('Alice'))  # Uses default greeting\nprint(greet('Bob', 'Hi'))",
              explanation: "This example shows how to define a function with parameters, including a default value. The function returns a greeting message that combines the greeting and name parameters."
            }
          ]
        }
      }
    ]
  },
  2: {
    title: "Spanish for Travelers",
    category: "Languages",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1551649779-a3aa7bd7edb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    sections: [
      {
        id: "greetings",
        title: "Essential Greetings",
        content: {
          notes: [
            "Greetings are an important part of Spanish culture.",
            "It's common to greet everyone individually in a group setting.",
            "Spanish greetings vary based on the time of day.",
            "Formal vs. informal greetings depend on your relationship with the person."
          ],
          theory: [
            {
              title: "Formality in Spanish",
              content: "Spanish has two forms of 'you': 'tú' (informal) and 'usted' (formal). Use 'tú' with friends, family, and children. Use 'usted' with strangers, elderly people, and in professional situations."
            },
            {
              title: "Regional Variations",
              content: "Spanish greetings can vary by country. For example, in Argentina, 'Hola, ¿cómo andás?' is common, while in Spain you might hear 'Hola, ¿qué tal?'"
            }
          ],
          examples: [
            {
              title: "Morning Greetings",
              code: "Buenos días = Good morning\n¿Cómo estás? = How are you? (informal)\n¿Cómo está usted? = How are you? (formal)",
              explanation: "Use 'Buenos días' in the morning until around noon. Follow up with 'Cómo estás' for friends or 'Cómo está usted' for formal situations."
            },
            {
              title: "Afternoon and Evening",
              code: "Buenas tardes = Good afternoon\nBuenas noches = Good evening/night",
              explanation: "Use 'Buenas tardes' from noon until sunset, and 'Buenas noches' after sunset. These can be used in both formal and informal situations."
            }
          ]
        }
      }
    ]
  }
};

function CourseContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { learningProfile, updateContentProgress, completeCourse } = useLearningProfile();
  
  const [courseData, setCourseData] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [activeTab, setActiveTab] = useState('notes');
  const [contentProgress, setContentProgress] = useState({});
  
  // Get icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const BookIcon = getIcon('Book');
  const BeakerIcon = getIcon('Beaker');
  const CodeIcon = getIcon('Code');
  const CheckCircleIcon = getIcon('CheckCircle');
  const AwardIcon = getIcon('Award');
  
  useEffect(() => {
    // In a real app, we would fetch this from an API
    const course = courseContentData[id];
    if (course) {
      setCourseData(course);
      
      // Initialize content progress
      const progress = {};
      course.sections.forEach((section) => {
        progress[section.id] = false;
      });
      
      // Check if we have existing progress in the learning profile
      if (learningProfile.contentProgress && learningProfile.contentProgress[id]) {
        setContentProgress(learningProfile.contentProgress[id]);
      } else {
        setContentProgress(progress);
      }
    } else {
      toast.error("Course content not found");
      navigate('/');
    }
  }, [id, navigate, learningProfile]);
  
  if (!courseData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading course content...</div>
      </div>
    );
  }
  
  const markSectionComplete = (sectionId) => {
    const newProgress = { ...contentProgress, [sectionId]: true };
    setContentProgress(newProgress);
    updateContentProgress(id, newProgress);
    toast.success("Section marked as complete!");
  };
  
  const handleCompleteCourse = () => {
    const allSectionsComplete = courseData.sections.every(section => contentProgress[section.id]);
    
    if (!allSectionsComplete) {
      toast.warning("Please complete all sections before marking the course as complete.");
      return;
    }
    
    const course = {
      id: parseInt(id),
      title: courseData.title,
      category: courseData.category,
      level: courseData.level,
      image: courseData.image,
      modules: courseData.sections.length,
      duration: `${courseData.sections.length * 2} hours` // Estimate
    };
    
    const success = completeCourse(course);
    
    if (success) {
      toast.success(
        <>
          <span>Congratulations! You've completed {courseData.title}. </span>
          <span className="font-bold">Certificate generated and added to your profile.</span>
        </>
      );
      navigate('/learning');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-primary hover:underline mb-4"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Back to Courses
      </button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{courseData.title}</h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{courseData.category}</span>
          <span className="px-3 py-1 bg-surface-200 dark:bg-surface-700 rounded-full text-sm">{courseData.level}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 card p-4">
            <h2 className="font-bold text-lg mb-4">Course Content</h2>
            <div className="space-y-2">
              {courseData.sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`w-full text-left p-2 rounded-lg flex items-start gap-2 transition-colors ${
                    activeSection === index 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  {contentProgress[section.id] ? (
                    <CheckCircleIcon className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-current flex-shrink-0" />
                  )}
                  <span>{section.title}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
              <button
                onClick={handleCompleteCourse}
                className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg 
                          transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <AwardIcon className="w-4 h-4" />
                Complete & Get Certificate
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="bg-surface-100 dark:bg-surface-800 p-4 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-bold">{courseData.sections[activeSection].title}</h2>
            </div>
            
            {/* Content Tabs */}
            <div className="border-b border-surface-200 dark:border-surface-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'notes'
                      ? 'border-primary text-primary'
                      : 'border-transparent hover:text-primary'
                  }`}
                >
                  <BookIcon className="w-4 h-4" /> Notes
                </button>
                <button
                  onClick={() => setActiveTab('theory')}
                  className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'theory'
                      ? 'border-primary text-primary'
                      : 'border-transparent hover:text-primary'
                  }`}
                >
                  <BeakerIcon className="w-4 h-4" /> Theory
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'examples'
                      ? 'border-primary text-primary'
                      : 'border-transparent hover:text-primary'
                  }`}
                >
                  <CodeIcon className="w-4 h-4" /> Examples
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-4">Key Notes</h3>
                  <ul className="space-y-3">
                    {courseData.sections[activeSection].content.notes.map((note, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'theory' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold mb-4">Theoretical Concepts</h3>
                  {courseData.sections[activeSection].content.theory.map((item, index) => (
                    <div key={index} className="mb-6">
                      <h4 className="font-bold text-primary mb-2">{item.title}</h4>
                      <p className="whitespace-pre-line">{item.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'examples' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold mb-4">Practical Examples</h3>
                  {courseData.sections[activeSection].content.examples.map((example, index) => (
                    <div key={index} className="mb-8">
                      <h4 className="font-bold text-primary mb-2">{example.title}</h4>
                      <pre className="bg-surface-800 text-white p-4 rounded-lg overflow-x-auto mb-3 font-mono text-sm">
                        {example.code}
                      </pre>
                      <p className="text-surface-600 dark:text-surface-300">{example.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-8 pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-between">
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                    activeSection === 0
                      ? 'text-surface-400 cursor-not-allowed'
                      : 'text-primary hover:bg-primary/10'
                  }`}
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Previous Section
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => markSectionComplete(courseData.sections[activeSection].id)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${
                      contentProgress[courseData.sections[activeSection].id]
                        ? 'bg-green-50 border-green-500 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : 'border-primary text-primary hover:bg-primary/10'
                    }`}
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    {contentProgress[courseData.sections[activeSection].id] ? 'Completed' : 'Mark Complete'}
                  </button>
                  
                  {activeSection < courseData.sections.length - 1 && (
                    <button
                      onClick={() => setActiveSection(activeSection + 1)}
                      className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-1"
                    >
                      Next Section <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseContent;