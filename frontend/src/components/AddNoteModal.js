'use client';

import { useState, useEffect } from 'react';

export default function AddNoteModal({ onClose, onSave, note }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('gray');
  const [category, setCategory] = useState('General');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const colors = [
    { name: 'gray', label: 'Gray' },
    { name: 'red', label: 'Red' },
    { name: 'orange', label: 'Orange' },
    { name: 'yellow', label: 'Yellow' },
    { name: 'green', label: 'Green' },
    { name: 'blue', label: 'Blue' },
    { name: 'purple', label: 'Purple' },
    { name: 'pink', label: 'Pink' },
  ];

  const categories = [
    'General',
    'Configuration',
    'Commands',
    'Code Snippets',
    'Credentials',
    'Ideas',
    'Tasks',
    'Learning',
    'Work',
    'Personal',
  ];

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setCategory(note.category);
    }
  }, [note]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const data = { title, content, color, category };
      await onSave(data);
    } catch (err) {
      console.error('Failed to save note:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg app-bg-card rounded-2xl border app-border p-6 sm:p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold app-text">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
          <button onClick={onClose} className="app-text-secondary hover:app-text transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold app-text-secondary mb-2 uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 app-bg-input app-border rounded-xl focus:outline-none focus:border-blue-500 app-text text-lg font-medium"
              placeholder="Give your note a title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold app-text-secondary mb-2 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 app-bg-input app-border rounded-xl focus:outline-none focus:border-blue-500 app-text appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold app-text-secondary mb-2 uppercase tracking-wider">Color</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      color === c.name ? 'border-blue-500 scale-110' : 'border-transparent'
                    } ${c.name === 'gray' ? 'bg-gray-500' : 
                         c.name === 'red' ? 'bg-red-500' :
                         c.name === 'orange' ? 'bg-orange-500' :
                         c.name === 'yellow' ? 'bg-yellow-500' :
                         c.name === 'green' ? 'bg-green-500' :
                         c.name === 'blue' ? 'bg-blue-500' :
                         c.name === 'purple' ? 'bg-purple-500' : 'bg-pink-500'}`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold app-text-secondary mb-2 uppercase tracking-wider">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-4 py-4 app-bg-input app-border rounded-xl focus:outline-none focus:border-blue-500 app-text resize-none"
              placeholder="What's on your mind?"
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 app-bg-pill app-hover rounded-xl transition-colors font-medium app-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {saving ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
