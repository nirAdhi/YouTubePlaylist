'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NoteCard from '../../components/NoteCard';
import AddNoteModal from '../../components/AddNoteModal';
import NoteViewModal from '../../components/NoteViewModal';
import ThemeToggle from '@/components/ThemeToggle';
import { fetchNotes, createNote, updateNote, deleteNote, togglePinNote } from '@/lib/api';

const DEFAULT_CATEGORIES = ['All', 'Ideas', 'Tasks', 'Personal', 'Work', 'Study'];

function NotesContent() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
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
      const msg = error?.response?.data?.error || error?.message || 'Failed to load notes.';
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
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
      setError('Failed to delete note.');
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const updated = await togglePinNote(note.id);
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
    } catch (error) {
      console.error('Failed to toggle pin:', error);
      setError('Failed to toggle pin.');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const dynamicCategories = Array.from(new Set(notes.map(n => n.category)));
  const allCategories = Array.from(new Set(['All', ...DEFAULT_CATEGORIES, ...dynamicCategories]));

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || note.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="min-h-screen app-bg transition-colors duration-200">
      <header className="app-bg-card app-border-b px-4 sm:px-6 py-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 app-hover rounded-lg app-text-secondary transition-colors"
            >
              ← Dashboard
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2 app-text">
              <span>📓</span> Notes
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => {
                setEditingNote(null);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              + New Note
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 app-bg-input app-border rounded-lg focus:outline-none focus:border-blue-500 app-text"
            />
            <span className="absolute left-3 top-2.5 opacity-50">🔍</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'app-bg-pill-active font-medium'
                    : 'app-bg-pill app-hover app-text-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="app-text-secondary">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20 app-bg-card rounded-2xl border app-border">
            <p className="app-text-muted text-lg">No notes found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pinnedNotes.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold app-text-muted uppercase tracking-wider mb-4">Pinned</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pinnedNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                      onClick={() => setViewingNote(note)}
                    />
                  ))}
                </div>
              </div>
            )}

            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h2 className="text-sm font-semibold app-text-muted uppercase tracking-wider mb-4">Others</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unpinnedNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                      onClick={() => setViewingNote(note)}
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

      {viewingNote && (
        <NoteViewModal
          note={viewingNote}
          onClose={() => setViewingNote(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
        />
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen app-bg flex items-center justify-center app-text">Loading...</div>}>
      <NotesContent />
    </Suspense>
  );
}
