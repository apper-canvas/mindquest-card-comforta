import { useState, useEffect, createContext } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import { LearningProfileProvider } from './context/LearningProfileContext';
import { ToastContainer } from 'react-toastify';
import { getIcon } from './utils/iconUtils';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Certificate from './pages/Certificate';
import CourseContent from './pages/CourseContent';
import Certificates from './pages/Certificates';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import LearningMaterials from './pages/LearningMaterials';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  const currentUser = userState?.user || null;

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register') || currentPath.includes('/callback') || currentPath.includes('/error');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        }
      }
    });
    setIsInitialized(true);
  }, [dispatch, navigate]);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Authentication methods to share via context
  const authMethods = {
    isAuthenticated,
    currentUser,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        setMenuOpen(false);
      } catch (error) { console.error("Logout failed:", error); }
    }
  };

  // Get icons as components
  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const UserIcon = getIcon('User');
  const MenuIcon = getIcon('Menu');
  const BookIcon = getIcon('Book');
  const AwardIcon = getIcon('Award');

  return (
    <AuthContext.Provider value={authMethods}>
      <LearningProfileProvider>
        <div className="min-h-screen">
          <header className="fixed top-0 left-0 right-0 z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  M
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                  MindQuest
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-4">
                  <Link to="/" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">
                    Home
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">
                        Profile
                      </Link>
                      <Link to="/certificates" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">
                        Certificates
                      </Link>
                      <Link to="/learning" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1">
                        <BookIcon className="w-4 h-4" /> Learning Materials
                      </Link>
                      <button onClick={authMethods.logout} className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">
                      Login
                    </Link>
                  )}
                </div>
                
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
                
                <div className="relative md:hidden">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  >
                    <MenuIcon className="w-5 h-5" />
                  </button>
                  
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 py-2 z-50">
                      <Link to="/" className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left">Home</Link>
                      {isAuthenticated ? (
                        <>
                          <Link to="/profile" className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left">Profile</Link>
                          <Link to="/certificates" className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left">Certificates</Link>
                          <Link to="/learning" className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left flex items-center gap-2"><BookIcon className="w-4 h-4" /> Learning Materials</Link>
                          <button onClick={authMethods.logout} className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left">Logout</button>
                        </>
                      ) : (
                        <Link to="/login" className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left">Login</Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main className="pt-16 pb-8 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />} />
              <Route path="/profile" element={
                !isAuthenticated ? 
                <Navigate to="/login" state={{ from: location }} replace /> : 
                <Profile />
              } />
              <Route path="/certificate/:id" element={isAuthenticated ? <Certificate /> : <Navigate to="/login" replace />} />
              <Route path="/certificates" element={isAuthenticated ? <Certificates /> : <Navigate to="/login" replace />} />
              <Route path="/learning" element={isAuthenticated ? <LearningMaterials /> : <Navigate to="/login" state={{ from: location }} replace />} />
              <Route path="/course/:id" element={isAuthenticated ? <CourseContent /> : <Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <footer className="bg-surface-100 dark:bg-surface-800 py-6 border-t border-surface-200 dark:border-surface-700">
            <div className="container mx-auto px-4">
              <div className="text-center text-surface-600 dark:text-surface-400 text-sm">
                &copy; {new Date().getFullYear()} MindQuest. All rights reserved.
              </div>
            </div>
          </footer>

          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? "dark" : "light"}
          />
          <div id="authentication" style={{ display: 'none' }}></div>
        </div>
      </LearningProfileProvider>
    </AuthContext.Provider>
  );
}

export default App;