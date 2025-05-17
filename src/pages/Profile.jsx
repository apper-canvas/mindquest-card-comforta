import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils'; 
import { useAuth } from '../context/AuthContext';
import { useLearningProfile } from '../context/LearningProfileContext';
import { validateProfileData } from '../utils/authUtils';

function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const { learningProfile } = useLearningProfile();
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    bio: 'I love learning new things on MindQuest!',
    location: '',
    occupation: '',
    interests: '',
    preferences: {
      emailNotifications: true,
      darkMode: document.documentElement.classList.contains('dark')
    }
  });
  
  // Stats data
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    quizzesTaken: 0,
    averageScore: 0,
    hoursSpent: 0,
    totalExperience: 0
  });

  // Get icons
  const EditIcon = getIcon('Edit');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const BookIcon = getIcon('Book');
  const AwardIcon = getIcon('Award');
  const BrainIcon = getIcon('Brain');
  const ClockIcon = getIcon('Clock');
  const StarIcon = getIcon('Star');
  const MapPinIcon = getIcon('MapPin');
  const BriefcaseIcon = getIcon('Briefcase');
  const HeartIcon = getIcon('Heart');
  const CameraIcon = getIcon('Camera');
  const ImageIcon = getIcon('Image');

  // Set initial profile data from current user
  useEffect(() => {
    if (currentUser) {
      setProfileData(prev => ({
        ...prev,
        displayName: currentUser.displayName,
        email: currentUser.email,
        bio: currentUser.bio || prev.bio,
        location: currentUser.location || '',
        occupation: currentUser.occupation || '',
        interests: currentUser.interests || ''
      }));
    }
  }, [currentUser]);

  // Calculate stats from learning profile
  useEffect(() => {
    // Calculate total quiz attempts across all subjects
    const quizAttempts = Object.values(learningProfile.subjects).flatMap(
      subject => subject.quizAttempts
    );
    
    // Calculate average score
    const totalScore = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageScore = quizAttempts.length > 0 ? totalScore / quizAttempts.length : 0;
    
    // Set the stats
    setStats({
      coursesCompleted: Math.floor(Math.random() * 5), // Mock data
      quizzesTaken: quizAttempts.length,
      averageScore: Math.round(averageScore * 100) / 100,
      hoursSpent: Math.floor(Math.random() * 50) + 5, // Mock data
      totalExperience: learningProfile.experiencePoints
    });
  }, [learningProfile]);

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = {};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties like preferences.darkMode
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle top-level properties
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setFileError('Please select an image file (JPG, PNG, GIF)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('Image size should not exceed 5MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    // In a real application, this would update the user's profile in the database
    const validation = validateProfileData(profileData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      toast.error('Please fix the errors in your profile data');
      return;
    }
    
    try {
      await updateProfile(profileData, selectedFile);
      setIsEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
            
            {isEditMode ? (
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="btn btn-primary flex items-center gap-1"
                >
                  <CheckIcon className="w-4 h-4" /> Save
                </button>
                <button 
                  onClick={() => setIsEditMode(false)}
                  className="btn btn-outline flex items-center gap-1"
                >
                  <XIcon className="w-4 h-4" /> Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditMode(true)}
                className="btn btn-outline flex items-center gap-1"
              >
                <EditIcon className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                {isEditMode ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-primary relative group">
                    <img 
                      src={previewUrl || currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.displayName)}&background=6366f1&color=fff&size=128`} 
                      alt={profileData.displayName}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => document.getElementById('profilePicture').click()}
                    >
                      <div className="text-white text-center">
                        <CameraIcon className="w-8 h-8 mx-auto mb-1" />
                        <span className="text-xs">Change Photo</span>
                      </div>
                    </div>
                    <input 
                      type="file" 
                      id="profilePicture" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-primary">
                    <img 
                      src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.displayName)}&background=6366f1&color=fff&size=128`} 
                      alt={profileData.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {fileError && <p className="text-red-500 text-sm mb-4">{fileError}</p>}

                {isEditMode ? (
                  <div className="w-full space-y-4">
                    <div>
                      <label htmlFor="displayName" className="form-label">Display Name</label>
                      <input 
                        type="text" 
                        id="displayName" 
                        name="displayName" 
                        value={profileData.displayName} 
                        onChange={handleChange}
                        className="form-input" 
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="bio" className="form-label">Bio</label>
                      <textarea 
                        id="bio" 
                        name="bio" 
                        value={profileData.bio} 
                        onChange={handleChange}
                        rows={4}
                        className="form-input" 
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="form-label">Location</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                          <MapPinIcon className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          id="location" 
                          name="location" 
                          value={profileData.location} 
                          onChange={handleChange}
                          className="form-input pl-10" 
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="occupation" className="form-label">Occupation</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                          <BriefcaseIcon className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          id="occupation" 
                          name="occupation" 
                          value={profileData.occupation} 
                          onChange={handleChange}
                          className="form-input pl-10" 
                          placeholder="Your occupation"
                        />
                      </div>
                      {formErrors.occupation && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.occupation}</p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="emailNotifications" 
                        name="preferences.emailNotifications" 
                        checked={profileData.preferences.emailNotifications} 
                        onChange={handleChange}
                        className="mr-2 rounded text-primary focus:ring-primary" 
                      />
                      <label htmlFor="emailNotifications" className="text-sm">
                        Receive email notifications
                      </label>
                    </div>
                    <div>
                      <label htmlFor="interests" className="form-label">Interests</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-500">
                          <HeartIcon className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          id="interests" 
                          name="interests" 
                          value={profileData.interests} 
                          onChange={handleChange}
                          className="form-input pl-10" 
                          placeholder="Coding, learning, etc."
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">{profileData.displayName}</h2>
                    <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">{profileData.email}</p>
                    {profileData.location && <p className="text-surface-600 dark:text-surface-400 text-sm mb-2"><MapPinIcon className="inline w-4 h-4 mr-1" />{profileData.location}</p>}
                    {profileData.occupation && <p className="text-surface-600 dark:text-surface-400 text-sm mb-2"><BriefcaseIcon className="inline w-4 h-4 mr-1" />{profileData.occupation}</p>}
                    <p className="text-surface-700 dark:text-surface-300">{profileData.bio}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h2 className="text-xl font-bold mb-4">Learning Statistics</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700 flex items-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary mr-3">
                    <BookIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-surface-600 dark:text-surface-400 text-sm">Courses Completed</p>
                    <p className="text-xl font-bold">{stats.coursesCompleted}</p>
                  </div>
                </div>
                
                <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700 flex items-center">
                  <div className="p-3 rounded-full bg-secondary/10 text-secondary mr-3">
                    <BrainIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-surface-600 dark:text-surface-400 text-sm">Quizzes Taken</p>
                    <p className="text-xl font-bold">{stats.quizzesTaken}</p>
                  </div>
                </div>
                
                <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700 flex items-center">
                  <div className="p-3 rounded-full bg-accent/10 text-accent mr-3">
                    <StarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-surface-600 dark:text-surface-400 text-sm">Average Score</p>
                    <p className="text-xl font-bold">{stats.averageScore}%</p>
                  </div>
                </div>
                
                <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700 flex items-center">
                  <div className="p-3 rounded-full bg-green-500/10 text-green-500 mr-3">
                    <ClockIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-surface-600 dark:text-surface-400 text-sm">Hours Spent</p>
                    <p className="text-xl font-bold">{stats.hoursSpent}</p>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-4">Achievements</h2>
              <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700 flex items-center">
                <div className="p-3 rounded-full bg-purple-500/10 text-purple-500 mr-3">
                  <AwardIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-surface-600 dark:text-surface-400 text-sm">Total Experience Points</p>
                  <p className="text-xl font-bold">{stats.totalExperience} XP</p>
                </div>
              </div>
              
              {!isEditMode && profileData.interests && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-4">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.split(',').map((interest, index) => (
                      interest.trim() && (
                        <span 
                          key={index} 
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {interest.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;