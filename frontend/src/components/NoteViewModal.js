'use client';

import { useState } from 'react';

export default function NoteViewModal({ note, onClose, onEdit, onDelete, onTogglePin }) {
  const colorMap = {
    gray: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
    red: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30',
    orange: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/30',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30',
    green: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30',
    blue: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30',
    purple: 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900/30',
    pink: 'bg-pink-50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-900/30',
  };

  const colorStyle = colorMap[note.color] || colorMap.gray;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className={`w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 ${colorStyle}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-black/5 dark:border-white/5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 app-text-secondary">
                {note.category}
              </span>
              {note.isPinned && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                  📌 Pinned
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold app-text">
              {note.title}
            </h2>
            <p className="text-xs app-text-muted mt-2">
              Last updated {new Date(note.updatedAt).toLocaleString()}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 app-hover rounded-full app-text-secondary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <p className="app-text-secondary text-lg leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 dark:border-white/5 flex gap-3 justify-end bg-black/5 dark:bg-white/5">
          <button
            onClick={() => onTogglePin(note)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              note.isPinned
                ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/30'
                : 'app-bg-pill app-text-secondary hover:app-bg-pill-active'
            }`}
          >
            {note.isPinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            onClick={() => {
              onEdit(note);
              onClose();
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            Edit Note
          </button>
          <button
            onClick={() => {
              onDelete(note.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600/10 text-red-600 dark:text-red-400 hover:bg-red-600/20 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
