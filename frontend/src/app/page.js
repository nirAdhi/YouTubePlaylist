'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoCard from '@/components/VideoCard';
import AddVideoModal from '@/components/AddVideoModal';
import PlaylistSidebar from '@/components/PlaylistSidebar';
import ReminderModal from '@/components/ReminderModal';
import { fetchVideos, fetchPlaylists } from '@/lib/api';

const categories = [
  'All',
  'Relaxing',
  'Motivational',
  'Funny',
  'Music',
  'Learning',
  'Tech',
  'Gaming',
  'Fitness',
  'Cooking',
  'News',
  'Productivity',
  'Creative',
  'Entertainment',
  'Other',
];

const categoryColors = {
  Relaxing: 'bg-teal-600',
  Motivational: 'bg-orange-600',
  Funny: 'bg-yellow-600',
  Music: 'bg-pink-600',
  Learning: 'bg-blue-600',
  Tech: 'bg-cyan-600',
  Gaming: 'bg-purple-600',
  Fitness: 'bg-green-600',
  Cooking: 'bg-red-600',
  News: 'bg-slate-600',
  Productivity: 'bg-indigo-600',
  Creative: 'bg-rose-600',
  Entertainment: 'bg-violet-600',
  Other: 'bg-gray-600',
};

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [prefilledUrl, setPrefilledUrl] = useState('');
  const [reminderVideo, setReminderVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle shared URLs from Android Share
  useEffect(() => {
    const addUrl = searchParams.get('addUrl');
    if (addUrl) {
      setPrefilledUrl(addUrl);
      setShowAddModal(true);
      // Clean URL param
      router.replace('/', { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      router.push('/login');
      return;
    }
    if (userData) setUser(JSON.parse(userData));
    loadData();
  }, []);

  async function loadData() {
    try {
      const [v, p] = await Promise.all([fetchVideos(), fetchPlaylists()]);
      setVideos(v);
      setPlaylists(p);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    }
  }

  const filteredVideos = videos.filter((v) => {
    if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
    if (selectedPlaylist) {
      const playlist = playlists.find((p) => p.id === selectedPlaylist);
      if (!playlist?.videos?.some((pv) => pv.videoId === v.id)) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  function handleSidebarSelect(id) {
    setSelectedPlaylist(id);
    setSidebarOpen(false);
  }

  function handleCloseAddModal() {
    setShowAddModal(false);
    setPrefilledUrl('');
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <PlaylistSidebar
          playlists={playlists}
          selectedPlaylist={selectedPlaylist}
          onSelect={handleSidebarSelect}
          onUpdate={loadData}
          onCloseMobile={() => setSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 min-w-0">
        {/* Mobile-optimized header */}
        <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur border-b border-gray-750 px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Hamburger menu for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h1 className="font-bold text-base sm:text-lg hidden sm:block">VidVault</h1>
            </div>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 sm:px-4 py-2 bg-gray-850 border border-gray-750 rounded-full text-sm focus:outline-none focus:border-gray-600"
              />
            </div>

            {/* Add button - icon only on small screens */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-850 hover:bg-gray-750 rounded-full text-sm font-medium transition-colors active:bg-gray-700 min-h-[44px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add</span>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 text-sm text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        <div className="px-3 sm:px-6 py-3 sm:py-4">
          {/* Category pills - horizontal scroll on all sizes */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 sm:mb-4 scrollbar-hide -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 min-h-[36px] ${
                  selectedCategory === cat
                    ? 'bg-white text-gray-950 font-medium'
                    : 'bg-gray-850 hover:bg-gray-750'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-gray-400 text-lg">No videos found</p>
              <p className="text-gray-500 text-sm mt-1">
                Add your first video to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  playlists={playlists}
                  onUpdate={loadData}
                  onDelete={loadData}
                  onSetReminder={setReminderVideo}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddVideoModal
          prefilledUrl={prefilledUrl}
          onClose={handleCloseAddModal}
          onAdded={(addedVideo) => {
            loadData();
            if (addedVideo?.category) {
              setSelectedCategory(addedVideo.category);
            }
          }}
        />
      )}
      {reminderVideo && (
        <ReminderModal
          video={reminderVideo}
          onClose={() => setReminderVideo(null)}
          onCreated={loadData}
        />
      )}
    </div>
  );
}
