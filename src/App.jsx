import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LearningProfileProvider } from './context/LearningProfileContext';
import { ToastContainer } from 'react-toastify';
import { getIcon } from './utils/iconUtils';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Certificate from './pages/Certificate';
import Certificates from './pages/Certificates';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  // Get icons as components
  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const UserIcon = getIcon('User');
  const MenuIcon = getIcon('Menu');
  const AwardIcon = getIcon('Award');
  return (
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
              {currentUser ? (
                <>
                  <Link to="/profile" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">
                    Profile
                  </Link>
                  <Link to="/certificates" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">
                    Certificates
                  </Link>
                  <button onClick={handleLogout} className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">
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
                  {currentUser ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left">Profile</Link>
                      <Link to="/certificates" className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left">Certificates</Link>
                      <button onClick={handleLogout} className="block px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 w-full text-left">Logout</button>
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
          <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/forgot-password" element={currentUser ? <Navigate to="/" replace /> : <ForgotPassword />} />
          <Route path="/profile" element={
            !currentUser ? 
            <Navigate to="/login" state={{ from: location }} replace /> : 
            <Profile />
          } />
          <Route path="/certificate/:id" element={currentUser ? <Certificate /> : <Navigate to="/login" replace />} />
          <Route path="/certificates" element={currentUser ? <Certificates /> : <Navigate to="/login" replace />} />
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
    </div>
    </LearningProfileProvider>
  );
}

export default App;