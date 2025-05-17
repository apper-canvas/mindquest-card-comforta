import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCertificates } from '../utils/certificateUtils';
import { getIcon } from '../utils/iconUtils';
import { useLearningProfile } from '../context/LearningProfileContext';
import CertificateCard from '../components/CertificateCard';

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { learningProfile } = useLearningProfile();
  
  // Get icons
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const SortIcon = getIcon('ArrowUpDown');
  const EmptyIcon = getIcon('FileX');
  
  useEffect(() => {
    // In a real app, we would fetch certificates from an API
    // For this demo, we'll use the ones from learning profile or localStorage
    const loadCertificates = () => {
      try {
        const certs = learningProfile.certificates || getAllCertificates();
        setCertificates(certs);
      } catch (error) {
        console.error('Error loading certificates:', error);
        toast.error('Failed to load certificates. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCertificates();
  }, [learningProfile]);
  
  // Filter and sort certificates
  const filteredAndSortedCertificates = [...certificates]
    .filter(cert => {
      if (filter === 'all') return true;
      return cert.courseCategory.toLowerCase() === filter.toLowerCase();
    })
    .sort((a, b) => {
      const dateA = new Date(a.issueDate);
      const dateB = new Date(b.issueDate);
      
      if (sortBy === 'newest') {
        return dateB - dateA;
      } else if (sortBy === 'oldest') {
        return dateA - dateB;
      } else if (sortBy === 'titleAZ') {
        return a.courseTitle.localeCompare(b.courseTitle);
      } else if (sortBy === 'titleZA') {
        return b.courseTitle.localeCompare(a.courseTitle);
      }
      return 0;
    });
  
  // Get unique categories for filter
  const categories = ['all', ...new Set(certificates.map(cert => cert.courseCategory.toLowerCase()))];
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-lg">Loading certificates...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Certificates</h1>
      
      {certificates.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
                <div className="p-2 text-surface-400">
                  <FilterIcon className="w-5 h-5" />
                </div>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-2 bg-transparent border-none focus:ring-0"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
                <div className="p-2 text-surface-400">
                  <SortIcon className="w-5 h-5" />
                </div>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 bg-transparent border-none focus:ring-0"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="titleAZ">Title A-Z</option>
                  <option value="titleZA">Title Z-A</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-surface-500 dark:text-surface-400">
              Showing {filteredAndSortedCertificates.length} of {certificates.length} certificates
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCertificates.map(certificate => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <EmptyIcon className="w-16 h-16 text-surface-300 dark:text-surface-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Certificates Yet</h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-md mb-6">
            Complete courses to earn certificates that showcase your skills and achievements.
          </p>
          <Link 
            to="/" 
            className="btn btn-primary"
          >
            Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
}

export default Certificates;