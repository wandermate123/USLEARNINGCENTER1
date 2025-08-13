import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Users, Video, DollarSign, BarChart3, Settings, 
  BookOpen, Upload, Play, Trash2, Edit, Eye, Search,
  TrendingUp, Calendar, Award, FileText, Plus, Filter,
  Clock, CheckCircle, AlertCircle, Download, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import VideoUploadModal from '../components/VideoUploadModal';
import VideoPlayer from '../components/VideoPlayer';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshVideos, setRefreshVideos] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const stats = [
    { label: 'Enrolled Students', value: '47', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Monthly Revenue', value: '$4,180', change: '+8%', icon: DollarSign, color: 'green' },
    { label: 'Live Sessions', value: '128', change: '+5%', icon: Video, color: 'purple' },
    { label: 'Attendance Rate', value: '89%', change: '+3%', icon: Award, color: 'yellow' },
  ];

  const students = [
    { id: 1, name: 'Emma Johnson', age: 7, program: 'Level 2', progress: 85, lastLogin: '2 hours ago', package: '16 Sessions', sessionsLeft: 12 },
    { id: 2, name: 'Jake Chen', age: 9, program: 'Level 3', progress: 92, lastLogin: '1 day ago', package: '24 Sessions', sessionsLeft: 18 },
    { id: 3, name: 'Sophia Rodriguez', age: 6, program: 'Level 1', progress: 78, lastLogin: '3 hours ago', package: '8 Sessions', sessionsLeft: 5 },
    { id: 4, name: 'Lucas Smith', age: 8, program: 'Level 2', progress: 88, lastLogin: '5 hours ago', package: '16 Sessions', sessionsLeft: 10 },
    { id: 5, name: 'Olivia Brown', age: 10, program: 'Level 3', progress: 95, lastLogin: '30 minutes ago', package: '24 Sessions', sessionsLeft: 20 },
  ];

  const videos = [
    { 
      id: 1, 
      title: 'Phonics Basics - Letter Sounds', 
      category: 'Phonics', 
      duration: '12:30', 
      views: 156, 
      uploadDate: '2025-01-08',
      status: 'Published',
      ageGroup: '4-6',
      description: 'Introduction to basic letter sounds and phonetic awareness',
      file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail_url: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop'
    },
    { 
      id: 2, 
      title: 'Reading Comprehension Strategies', 
      category: 'Reading', 
      duration: '18:45', 
      views: 203, 
      uploadDate: '2025-01-07',
      status: 'Published',
      ageGroup: '7-9',
      description: 'Techniques to improve reading understanding and retention',
      file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail_url: 'https://images.pexels.com/photos/5212666/pexels-photo-5212666.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop'
    },
    { 
      id: 3, 
      title: 'Creative Writing Workshop', 
      category: 'Writing', 
      duration: '25:10', 
      views: 89, 
      uploadDate: '2025-01-06',
      status: 'Draft',
      ageGroup: '9-12',
      description: 'Encouraging creativity through structured writing exercises',
      file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail_url: 'https://images.pexels.com/photos/5212777/pexels-photo-5212777.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop'
    },
    { 
      id: 4, 
      title: 'Grammar Fundamentals', 
      category: 'Grammar', 
      duration: '15:20', 
      views: 167, 
      uploadDate: '2025-01-05',
      status: 'Published',
      ageGroup: '6-9',
      description: 'Essential grammar rules and sentence structure',
      file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail_url: 'https://images.pexels.com/photos/5212888/pexels-photo-5212888.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop'
    },
    { 
      id: 5, 
      title: 'Vocabulary Building Games', 
      category: 'Vocabulary', 
      duration: '20:05', 
      views: 142, 
      uploadDate: '2025-01-04',
      status: 'Published',
      ageGroup: '4-8',
      description: 'Interactive games to expand vocabulary knowledge',
      file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail_url: 'https://images.pexels.com/photos/5212999/pexels-photo-5212999.jpeg?auto=compress&cs=tinysrgb&w=320&h=180&fit=crop'
    },
  ];

  const assessments = [
    {
      id: 1,
      title: 'Initial Reading Assessment',
      type: 'Diagnostic',
      ageGroup: '4-12',
      questions: 15,
      duration: '20 minutes',
      completions: 47,
      averageScore: 78,
      createdDate: '2025-01-01',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Phonics Progress Check',
      type: 'Progress',
      ageGroup: '4-6',
      questions: 10,
      duration: '15 minutes',
      completions: 23,
      averageScore: 85,
      createdDate: '2025-01-03',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Writing Skills Evaluation',
      type: 'Skill-based',
      ageGroup: '7-12',
      questions: 8,
      duration: '30 minutes',
      completions: 31,
      averageScore: 72,
      createdDate: '2025-01-05',
      status: 'Draft'
    },
    {
      id: 4,
      title: 'Vocabulary Mastery Test',
      type: 'Achievement',
      ageGroup: '6-10',
      questions: 20,
      duration: '25 minutes',
      completions: 38,
      averageScore: 81,
      createdDate: '2025-01-07',
      status: 'Active'
    }
  ];

  const transactions = [
    { id: 1, student: 'Emma Johnson', amount: '$320', program: 'Level 2', package: '16 Sessions', date: '2025-01-10', status: 'Completed' },
    { id: 2, student: 'Jake Chen', amount: '$480', program: 'Level 3', package: '24 Sessions', date: '2025-01-09', status: 'Completed' },
    { id: 3, student: 'Sophia Rodriguez', amount: '$200', program: 'Level 1', package: '8 Sessions', date: '2025-01-08', status: 'Completed' },
    { id: 4, student: 'Lucas Smith', amount: '$320', program: 'Level 2', package: '16 Sessions', date: '2025-01-07', status: 'Pending' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Enrollments</h3>
          <div className="space-y-4">
            {students.slice(0, 3).map((student) => (
              <div key={student.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.program} • {student.package}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{student.sessionsLeft} sessions left</p>
                  <p className="text-xs text-gray-500">{student.lastLogin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {[
              { id: 1, title: 'Level 1 - Phonics Basics', time: 'Today 3:00 PM', students: 5 },
              { id: 2, title: 'Level 2 - Grammar Workshop', time: 'Tomorrow 4:00 PM', students: 6 },
              { id: 3, title: 'Level 3 - Creative Writing', time: 'Wed 3:30 PM', students: 4 }
            ].map((session) => (
              <div key={session.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{session.title}</p>
                  <p className="text-sm text-gray-500">{session.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.students} students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Enrolled Students</h2>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level & Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessions Left
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">Age {student.age}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.program}</div>
                      <div className="text-xs text-gray-500">{student.package}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{student.sessionsLeft}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const handleVideoUploadSuccess = () => {
    setRefreshVideos(prev => prev + 1);
  };

  const handleVideoView = (video: any) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleVideoEdit = (video: any) => {
    // TODO: Implement video editing functionality
    console.log('Edit video:', video);
  };

  const handleVideoDelete = (video: any) => {
    if (window.confirm(`Are you sure you want to delete "${video.title}"?`)) {
      // TODO: Implement video deletion
      console.log('Delete video:', video);
    }
  };

  const handleVideoStatusToggle = (video: any) => {
    const newStatus = video.status === 'Published' ? 'Draft' : 'Published';
    // TODO: Implement status toggle
    console.log(`Change ${video.title} status to ${newStatus}`);
  };

  const renderVideos = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Video Management</h2>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Phonics">Phonics</option>
            <option value="Reading">Reading</option>
            <option value="Writing">Writing</option>
            <option value="Grammar">Grammar</option>
            <option value="Vocabulary">Vocabulary</option>
            <option value="Speaking">Speaking</option>
            <option value="Listening">Listening</option>
          </select>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </button>
        </div>
      </div>

      {/* Video Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <Video className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Videos</p>
              <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{videos.reduce((sum, video) => sum + video.views, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{videos.filter(v => v.status === 'Published').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{videos.filter(v => v.status === 'Draft').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos
          .filter(video => selectedCategory === 'all' || video.category === selectedCategory)
          .map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-200">
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={() => handleVideoView(video)}
                    className="opacity-0 hover:opacity-100 bg-blue-600 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-110"
                  >
                    <Play className="h-6 w-6 ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    video.status === 'Published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {video.status}
                  </span>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {video.category}
                  </span>
                  <span>{video.ageGroup} years</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{video.views} views</span>
                  <span>{video.uploadDate}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleVideoView(video)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Watch Video"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleVideoEdit(video)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Edit Video"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleVideoDelete(video)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete Video"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleVideoStatusToggle(video)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      video.status === 'Published'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {video.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      
      {/* Empty State */}
      {videos.filter(video => selectedCategory === 'all' || video.category === selectedCategory).length === 0 && (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'all' 
              ? "You haven't uploaded any videos yet." 
              : `No videos found in the ${selectedCategory} category.`}
          </p>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Your First Video
          </button>
        </div>
      )}
    </div>
  );

  const renderAssessments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Assessment Management</h2>
        <button 
          onClick={() => setShowAssessmentModal(true)}
          className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Assessment
        </button>
      </div>

      {/* Assessment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completions</p>
              <p className="text-2xl font-bold text-gray-900">{assessments.reduce((sum, assessment) => sum + assessment.completions, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg. Score</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(assessments.reduce((sum, assessment) => sum + assessment.averageScore, 0) / assessments.length)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{assessments.filter(a => a.status === 'Active').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assessment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                      <div className="text-xs text-gray-500">{assessment.duration}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {assessment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assessment.ageGroup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assessment.questions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assessment.completions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assessment.averageScore}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assessment.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assessment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 mr-3">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Payment Analytics</h2>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$12,540</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">+12%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">$4,180</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level & Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.student}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-sm">{transaction.program}</div>
                    <div className="text-xs text-gray-500">{transaction.package}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const navigation = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'sessions', name: 'Live Sessions', icon: Video },
    { id: 'progress', name: 'Progress Tracking', icon: FileText },
    { id: 'payments', name: 'Payments', icon: DollarSign },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">US LEARNING CENTRE Admin</span>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    activeTab === item.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="ml-2 font-bold text-gray-900">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'sessions' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Sessions Management</h2>
              <p className="text-gray-600 mb-6">Manage Zoom sessions, schedules, and attendance tracking.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Level 1 Sessions</h3>
                  <p className="text-sm text-gray-600 mb-3">Beginner English classes</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Schedule:</strong> Mon & Wed 3:00 PM</p>
                    <p><strong>Students:</strong> 5 enrolled</p>
                    <p><strong>Zoom Link:</strong> Ready</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Level 2 Sessions</h3>
                  <p className="text-sm text-gray-600 mb-3">Intermediate English classes</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Schedule:</strong> Tue & Thu 4:00 PM</p>
                    <p><strong>Students:</strong> 6 enrolled</p>
                    <p><strong>Zoom Link:</strong> Ready</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Level 3 Sessions</h3>
                  <p className="text-sm text-gray-600 mb-3">Advanced English classes</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Schedule:</strong> Wed & Fri 3:30 PM</p>
                    <p><strong>Students:</strong> 4 enrolled</p>
                    <p><strong>Zoom Link:</strong> Ready</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'progress' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Tracking</h2>
              <p className="text-gray-600">Track student attendance, participation, and learning progress across all levels.</p>
            </div>
          )}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel for content management, user preferences, and system configuration.</p>
            </div>
          )}
        </div>
      </div>

      {/* Video Upload Modal */}
      <VideoUploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleVideoUploadSuccess}
      />
      
      {/* Video Player Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedVideo.title}</h3>
                  <p className="text-gray-600">{selectedVideo.category} • {selectedVideo.ageGroup} years • {selectedVideo.views} views</p>
                </div>
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="aspect-video mb-6">
                <VideoPlayer 
                  url={selectedVideo.file_url}
                  title={selectedVideo.title}
                  onProgress={(progress) => {
                    // Track video progress for analytics
                    console.log('Video progress:', progress);
                  }}
                  onEnded={() => {
                    // Track video completion
                    console.log('Video completed');
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedVideo.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Duration:</span>
                    <p className="text-gray-600">{selectedVideo.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Upload Date:</span>
                    <p className="text-gray-600">{selectedVideo.uploadDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Status:</span>
                    <p className={selectedVideo.status === 'Published' ? 'text-green-600' : 'text-yellow-600'}>
                      {selectedVideo.status}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Views:</span>
                    <p className="text-gray-600">{selectedVideo.views}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button 
                    onClick={() => handleVideoEdit(selectedVideo)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Video
                  </button>
                  <button 
                    onClick={() => handleVideoStatusToggle(selectedVideo)}
                    className={`px-4 py-2 rounded-lg transition-colors inline-flex items-center ${
                      selectedVideo.status === 'Published'
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedVideo.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Creation Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Assessment</h3>
                <button 
                  onClick={() => setShowAssessmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Title
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter assessment title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assessment Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select type</option>
                      <option value="Diagnostic">Diagnostic</option>
                      <option value="Progress">Progress</option>
                      <option value="Skill-based">Skill-based</option>
                      <option value="Achievement">Achievement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Group
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select age group</option>
                      <option value="4-6">4-6 years</option>
                      <option value="6-9">6-9 years</option>
                      <option value="9-12">9-12 years</option>
                      <option value="4-12">4-12 years</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter assessment instructions for students"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Question Builder</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question 1
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your question"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Option A"
                      />
                      <input 
                        type="text" 
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Option B"
                      />
                      <input 
                        type="text" 
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Option C"
                      />
                      <input 
                        type="text" 
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Option D"
                      />
                    </div>
                    <button 
                      type="button"
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      + Add Another Question
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => setShowAssessmentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Assessment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}