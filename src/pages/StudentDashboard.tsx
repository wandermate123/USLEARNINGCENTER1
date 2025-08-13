import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, Award, BookOpen, Video } from 'lucide-react';
import { fetchUpcomingSessions, fetchRecommendedVideos, type StudentSession } from '../lib/studentApi';
import type { Video as VideoType } from '../lib/supabase';

export default function StudentDashboard() {
  const { user, userProfile } = useAuth();
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const recentAchievements = [
    { id: 1, label: 'Completed 8/16 Sessions', value: '50%' },
    { id: 2, label: 'Reading Comprehension', value: 'Level Up' },
    { id: 3, label: 'Vocabulary Streak', value: '7 days' },
  ];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!userProfile?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const [upcoming, recVideos] = await Promise.all([
          fetchUpcomingSessions(userProfile.id),
          fetchRecommendedVideos(4),
        ]);
        
        if (!isMounted) return;
        setSessions(upcoming);
        setVideos(recVideos);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [userProfile?.id]);

  const nextSession = useMemo(() => sessions[0], [sessions]);

  const getUserDisplayName = () => {
    if (userProfile?.name) return userProfile.name;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Student';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome, {getUserDisplayName()}!</h1>
            <p className="text-gray-600 mt-2">{user?.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Next Session</h2>
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              {nextSession ? (
                <>
                  <p className="text-gray-700">{nextSession.title}</p>
                  <div className="mt-2 text-sm text-gray-600 flex items-center space-x-3">
                    <span className="inline-flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(nextSession.start_time).toLocaleString()}
                    </span>
                    {nextSession.teacher && <><span>•</span><span>{nextSession.teacher}</span></>}
                  </div>
                  <div className="mt-4">
                    {nextSession.zoom_url ? (
                      <a href={nextSession.zoom_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">Join Zoom</a>
                    ) : (
                      <span className="text-gray-400">Zoom link not available</span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-600">No upcoming sessions scheduled.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '50%' }} />
              </div>
              <p className="text-sm text-gray-600">Completed 8 of 16 sessions</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              <ul className="space-y-2">
                {recentAchievements.map(item => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
              <div className="divide-y divide-gray-100">
                {sessions.map(session => (
                  <div key={session.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{session.title}</p>
                      <p className="text-sm text-gray-600">{new Date(session.start_time).toLocaleString()} {session.teacher ? `• ${session.teacher}` : ''}</p>
                    </div>
                    {session.zoom_url ? (
                      <a href={session.zoom_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">Join</a>
                    ) : (
                      <span className="text-gray-400">No link</span>
                    )}
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="py-4 text-gray-600">No sessions found.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Resources</h2>
              <ul className="space-y-4">
                {videos.map(video => (
                  <li key={video.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Video className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{video.title}</p>
                        <p className="text-sm text-gray-600">{video.category}</p>
                      </div>
                    </div>
                    <a href={video.file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">Open</a>
                  </li>
                ))}
                {videos.length === 0 && (
                  <p className="text-gray-600">No recommendations right now.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

