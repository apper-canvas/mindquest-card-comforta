import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import LearningPathDisplay from '../components/LearningPathDisplay';
import { useLearningProfile } from '../context/LearningProfileContext';
import { AuthContext } from '../App';
import { getCourses } from '../services/CourseService';
import { markCourseCompleted } from '../services/CompletedCourseService';
import { generateCertificate } from '../services/CertificateService';
import { getUserCompletedCourses } from '../services/CompletedCourseService';

function Home() {
  const { learningProfile } = useLearningProfile();
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [courses, setCourses] = useState([]);
  const [completedCourseIds, setCompletedCourseIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const StarIcon = getIcon('Star');
  const UsersIcon = getIcon('Users');
  const ClockIcon = getIcon('Clock');
  const BookOpenIcon = getIcon('BookOpen');
  const BookIcon = getIcon('Book');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const AwardIcon = getIcon('Award');
  const TrendingUpIcon = getIcon('TrendingUp');
  const LoaderIcon = getIcon('Loader');
  
  // Fetch courses from the database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        if (isAuthenticated && currentUser) {
          const completedCourses = await getUserCompletedCourses(currentUser.userId);
          setCompletedCourseIds(completedCourses.map(course => course.courseId));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load courses. Please try again later.");
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, currentUser]);
  
  const filteredCourses = courses.filter(course => {
    // Filter by category if not 'all'
    const categoryMatch = activeFilter === 'all' || (course.category && course.category.toLowerCase() === activeFilter);
    
    // Filter by search query
    const searchMatch = 
      (course.title && course.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.category && course.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.level && course.level.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });
  
  const handleEnrollCourse = (courseId) => {
    toast.success(`Successfully enrolled in course! Your learning journey begins now.`);
  };
  
  const handleCompleteCourse = async (course) => {
    if (!isAuthenticated) {
      toast.warning("Please login to complete a course");
      return;
    }
    
    try {
      // Mark course as completed in the database
      const completedCourse = await markCourseCompleted(course.Id, currentUser.userId);
      
      // Generate certificate
      const certificateData = await generateCertificate({
        course,
        user: currentUser
      });
      
      // Update local state
      setCompletedCourseIds(prev => [...prev, course.Id]);
      
      toast.success(
        <div>
          <span>Congratulations! You've completed {course.title}. </span>
          <span className="font-bold">Certificate generated and added to your profile.</span>
        </div>
      );
    } catch (error) {
      console.error("Error completing course:", error);
      toast.error("Failed to complete course. Please try again.");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Expand Your Knowledge with Interactive Courses
          </h1>
          <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-8">
            Dive into engaging lessons, track your progress, and earn certifications 
            in programming, languages, mathematics, and more.
          </p>
        </div>
        
        <MainFeature />
      </section>
      
      {/* Learning Path Toggle Button */}
      <section className="mb-8 flex justify-center">
        <button 
          onClick={() => setShowLearningPath(!showLearningPath)}
          className="flex items-center gap-2 btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
        >
          <TrendingUpIcon className="w-5 h-5" />
          {showLearningPath ? 'Hide Learning Path' : 'View My Learning Path'}
        </button>
      </section>
      
      {/* Adaptive Learning Path */}
      {showLearningPath && (
        <section className="mb-12">
          <div className="max-w-4xl mx-auto">
            <LearningPathDisplay />
          </div>
        </section>
      )}
      
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {Object.values(learningProfile.subjects).some(subject => subject.quizAttempts.length > 0) ? (
            <h2 className="text-2xl md:text-3xl font-bold">Recommended For You</h2>
          ) : (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Explore Popular Courses</h2>
            
          <div className="flex flex-col sm:flex-row gap-3">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderIcon className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : (
        <>
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
                <SearchIcon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white dark:bg-surface-800 p-2 rounded-lg border border-surface-200 dark:border-surface-700">
              <FilterIcon className="w-5 h-5 text-surface-500" />
                  <span className="text-sm font-medium mr-2">Filter:</span>
                  <div className="flex gap-1">
                    {['all', 'programming', 'languages', 'mathematics'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          activeFilter === filter 
                            ? 'bg-primary text-white' 
                            : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
          </div>
          </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-20">
              <LoaderIcon className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map(course => {
              // Check if the course is completed
              const isCompleted = completedCourseIds.includes(course.Id);
                
              return (
                <div 
                  key={course.Id} 
                  className="card overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-white dark:bg-surface-800 rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                      <StarIcon className="w-3 h-3 text-accent" />
                      {course.rating}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex gap-2">
                        <span className="text-xs font-semibold text-white px-2 py-1 rounded-full bg-primary/80">
                          {course.level}
                        </span>
                        {isCompleted && (
                          <span className="text-xs font-semibold text-white px-2 py-1 rounded-full bg-green-500/80 flex items-center gap-1"><AwardIcon className="w-3 h-3" /> Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-primary-dark dark:text-primary-light font-semibold mb-2">
                      {course.category}
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                    
                    <div className="flex flex-wrap gap-3 mt-3 text-surface-500 dark:text-surface-400 text-xs">
                      <div className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        <span>{new Intl.NumberFormat().format(course.enrolled)} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpenIcon className="w-4 h-4" />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {isCompleted ? (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => window.location.href = `/certificate/${learningProfile.certificates.find(cert => cert.courseId === course.id)?.id}`}
                          className="flex-1 py-2 px-4 bg-secondary hover:bg-secondary-dark text-white rounded-lg 
                                    transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                          <AwardIcon className="w-4 h-4" />
                           View Certificate
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 flex gap-2">
                        <Link 
                          to="/learning" 
                          className="flex-1 min-w-0 py-2 px-2 sm:px-3 bg-primary-light dark:bg-primary-dark text-primary dark:text-primary-light rounded-lg 
                                   border border-primary/20 transition-colors duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm whitespace-nowrap"
                         >
                           <BookIcon className="w-4 h-4 flex-shrink-0" />
                           <span className="truncate">View Materials</span>
                         </Link>
                         <button
                           onClick={() => handleCompleteCourse(course)}
                           className="flex-1 min-w-0 py-2 px-2 sm:px-3 bg-primary hover:bg-primary-dark text-white rounded-lg 
                                    transition-colors duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm whitespace-nowrap"
                           title="Skip learning materials and complete course directly"
                           aria-label="Complete course and get certificate without studying materials"
                         >
                           <span className="truncate">Complete Course</span>
                           <AwardIcon className="w-4 h-4 flex-shrink-0" />
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <div className="text-surface-500 dark:text-surface-400 text-lg">
                No courses found matching your criteria. Try adjusting your filters.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default Home;