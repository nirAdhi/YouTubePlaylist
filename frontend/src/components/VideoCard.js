'use client';

import { useState } from 'react';
import { updateVideo, deleteVideo, addVideoToPlaylist } from '@/lib/api';

const statusColors = {
  unwatched: 'bg-gray-600',
  'in-progress': 'bg-yellow-600',
  watched: 'bg-green-600',
};

const statusLabels = {
  unwatched: 'Unwatched',
  'in-progress': 'In Progress',
  watched: 'Watched',
};

const categoryColors = {
  Relaxing: 'bg-teal-600/20 text-teal-300',
  Motivational: 'bg-orange-600/20 text-orange-300',
  Funny: 'bg-yellow-600/20 text-yellow-300',
  Music: 'bg-pink-600/20 text-pink-300',
  Learning: 'bg-blue-600/20 text-blue-300',
  Tech: 'bg-cyan-600/20 text-cyan-300',
  Gaming: 'bg-purple-600/20 text-purple-300',
  Fitness: 'bg-green-600/20 text-green-300',
  Cooking: 'bg-red-600/20 text-red-300',
  News: 'bg-slate-600/20 text-slate-300',
  Productivity: 'bg-indigo-600/20 text-indigo-300',
  Creative: 'bg-rose-600/20 text-rose-300',
  Entertainment: 'bg-violet-600/20 text-violet-300',
  Other: 'bg-gray-600/20 text-gray-300',
};

export default function VideoCard({ video, playlists, onUpdate, onDelete, onSetReminder }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  async function toggleStatus() {
    const next =
      video.watchStatus === 'unwatched'
        ? 'in-progress'
        : video.watchStatus === 'in-progress'
        ? 'watched'
        : 'unwatched';
    await updateVideo(video.id, { watchStatus: next });
    onUpdate();
  }

  async function handleAddToPlaylist(playlistId) {
    await addVideoToPlaylist(playlistId, video.id);
    setPlaylistOpen(false);
    onUpdate();
  }

  async function handleDelete() {
    if (confirm('Delete this video?')) {
      await deleteVideo(video.id);
      onDelete();
    }
  }

  return (
    <div className="group relative bg-gray-850 rounded-lg overflow-hidden border border-gray-750 hover:border-gray-600 transition-colors">
      <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative aspect-video bg-gray-950">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/480x270?text=No+Thumbnail';
            }}
          />
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-xs rounded">
            {video.duration}
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 leading-snug mb-1">{video.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[video.category] || categoryColors.Other}`}>
                {video.category}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">{video.channel}</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full text-white ${statusColors[video.watchStatus]}`}
            >
              {statusLabels[video.watchStatus]}
            </span>
          </div>
        </div>
      </a>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 bg-black/60 rounded-lg hover:bg-black/80"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-10 right-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-lg z-20 py-1">
            <button
              onClick={() => {
                toggleStatus();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
            >
              Mark {video.watchStatus === 'watched' ? 'Unwatched' : video.watchStatus === 'in-progress' ? 'Watched' : 'In Progress'}
            </button>
            <button
              onClick={() => {
                setPlaylistOpen(true);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
            >
              Add to Playlist
            </button>
            <button
              onClick={() => {
                onSetReminder(video);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
            >
              Set Reminder
            </button>
            <button
              onClick={() => {
                handleDelete();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400"
            >
              Delete
            </button>
          </div>
        </>
      )}

      {playlistOpen && (
        <>
          <div className="fixed inset-0 z-10 bg-black/50" onClick={() => setPlaylistOpen(false)} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-lg z-30 p-4">
            <h4 className="font-medium mb-3">Add to Playlist</h4>
            {playlists.length === 0 ? (
              <p className="text-sm text-gray-400">No playlists yet</p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-auto">
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddToPlaylist(pl.id)}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-700"
                  >
                    {pl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
