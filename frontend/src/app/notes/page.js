'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NoteCard from '../../components/NoteCard';
import AddNoteModal from '../../components/AddNoteModal';
import ThemeToggle from '@/components/ThemeToggle';
import { fetchNotes, createNote, updateNote, deleteNote, togglePinNote } from '@/lib/api';

function NotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadNotes();
  }, [router]);

  const loadNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      const msg = error?.response?.data?.error || error?.message || 'Failed to load notes. Please try again.';
      setError(msg);
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (noteData) => {
    setError(null);
    try {
      let saved;
      if (editingNote) {
        saved = await updateNote(editingNote.id, noteData);
        setNotes(notes.map((n) => (n.id === saved.id ? saved : n)));
      } else {
        saved = await createNote(noteData);
        setNotes([saved, ...notes]);
      }
      setEditingNote(null);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save note:', error);
      const msg = error?.response?.data?.error || error?.message || 'Failed to save note. Please try again.';
      setError(msg);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    setError(null);
    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
      const msg = error?.response?.data?.error || error?.message || 'Failed to delete note.';
      setError(msg);
    }
  };

  const handleTogglePin = async (note) => {
    setError(null);
    try {
      const updated = await togglePinNote(note.id);
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
    } catch (error) {
      console.error('Failed to toggle pin:', error);
      const msg = error?.response?.data?.error || error?.message || 'Failed to toggle pin.';
      setError(msg);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const categories = ['all', ...new Set(notes.map((n) => n.category))];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {error && (
            <div className="mb-3 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-300 hover:text-white ml-2"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white"
              >
                ← Back to Videos
              </button>
              <h1 className="text-xl font-bold">📝 Notes</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => {
                  setEditingNote(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                + New Note
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mt-4">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No notes yet</h2>
            <p className="text-gray-500 mb-4">
              Create your first note to store configuration, commands, or important information.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Create Note
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {pinnedNotes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  📌 Pinned ({pinnedNotes.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </div>
            )}

            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h2 className="text-lg font-semibold text-gray-300 mb-4">
                    Other Notes ({unpinnedNotes.length})
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unpinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showModal && (
        <AddNoteModal
          onClose={() => {
            setShowModal(false);
            setEditingNote(null);
          }}
          onSave={handleSave}
          note={editingNote}
        />
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
      <NotesContent />
    </Suspense>
  );
}
