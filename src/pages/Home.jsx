import { useState } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Sample course data
const popularCourses = [
  {
    id: 1,
    title: "Python for Beginners",
    category: "Programming",
    level: "Beginner",
    rating: 4.9,
    enrolled: 12500,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    modules: 8,
    duration: "12 hours"
  },
  {
    id: 2,
    title: "Spanish for Travelers",
    category: "Languages",
    level: "Intermediate",
    rating: 4.7,
    enrolled: 8300,
    image: "https://images.unsplash.com/photo-1551649779-a3aa7bd7edb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    modules: 10,
    duration: "15 hours"
  },
  {
    id: 3,
    title: "Advanced Calculus",
    category: "Mathematics",
    level: "Advanced",
    rating: 4.8,
    enrolled: 5200,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    modules: 12,
    duration: "20 hours"
  },
  {
    id: 4,
    title: "Web Development Bootcamp",
    category: "Programming",
    level: "Intermediate",
    rating: 4.9,
    enrolled: 14200,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    modules: 15,
    duration: "30 hours"
  }
];

function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get icons as components
  const StarIcon = getIcon('Star');
  const UsersIcon = getIcon('Users');
  const ClockIcon = getIcon('Clock');
  const BookOpenIcon = getIcon('BookOpen');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  
  const filteredCourses = popularCourses.filter(course => {
    // Filter by category if not 'all'
    const categoryMatch = activeFilter === 'all' || course.category.toLowerCase() === activeFilter;
    
    // Filter by search query
    const searchMatch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        course.level.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  
  const handleEnrollCourse = (courseId) => {
    toast.success(`Successfully enrolled in course! Your learning journey begins now.`);
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
      
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">Explore Popular Courses</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-surface-200 dark:border-surface-700 
                          bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-primary"
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div 
                key={course.id} 
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
                    <span className="text-xs font-semibold text-white px-2 py-1 rounded-full bg-primary/80">
                      {course.level}
                    </span>
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
                  
                  <button
                    onClick={() => handleEnrollCourse(course.id)}
                    className="mt-4 w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg 
                              transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))
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