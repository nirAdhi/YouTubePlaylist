'use client';

import { useState } from 'react';
import { createPlaylist, deletePlaylist } from '@/lib/api';

export default function PlaylistSidebar({ playlists, selectedPlaylist, onSelect, onUpdate }) {
  const [newName, setNewName] = useState('');
  const [showInput, setShowInput] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    await createPlaylist(newName);
    setNewName('');
    setShowInput(false);
    onUpdate();
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (confirm('Delete this playlist?')) {
      await deletePlaylist(id);
      onUpdate();
    }
  }

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-750 bg-gray-850 min-h-screen p-4">
      <h2 className="font-bold text-lg mb-4">Library</h2>
      <nav className="space-y-1">
        <button
          onClick={() => onSelect(null)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            selectedPlaylist === null ? 'bg-gray-750 font-medium' : 'hover:bg-gray-750'
          }`}
        >
          All Videos
        </button>
        {playlists.map((pl) => (
          <div
            key={pl.id}
            onClick={() => onSelect(pl.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group cursor-pointer ${
              selectedPlaylist === pl.id ? 'bg-gray-750 font-medium' : 'hover:bg-gray-750'
            }`}
          >
            <div className="flex items-center overflow-hidden">
              <span className="truncate">{pl.name}</span>
              <span className="text-gray-500 text-xs ml-2 flex-shrink-0">{pl.videos?.length || 0}</span>
            </div>
            <button
              onClick={(e) => handleDelete(pl.id, e)}
              className="opacity-0 group-hover:opacity-100 ml-2 text-gray-500 hover:text-red-400 flex-shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </nav>

      {showInput ? (
        <form onSubmit={handleCreate} className="mt-4">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Playlist name"
            className="w-full px-3 py-1.5 bg-gray-950 border border-gray-750 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="flex-1 py-1 text-xs bg-gray-750 hover:bg-gray-700 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded">
              Create
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="mt-4 w-full py-2 text-sm text-blue-400 hover:bg-gray-750 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Playlist
        </button>
      )}
    </div>
  );
}
