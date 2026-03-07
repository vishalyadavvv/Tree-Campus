import React from 'react';
import { FiX, FiFileText } from 'react-icons/fi';

const NoteModal = ({ isOpen, onClose, note }) => {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Model */}
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <FiFileText className="text-teal-600" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{note.heading || 'Study Note'}</h3>
              {/* <p className="text-sm text-gray-500">Full Content View</p> */}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-gray-50/30">
          <div className="prose prose-orange max-w-none">
            <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {note.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white text-center flex-shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-teal-500/20 active:scale-95"
          >
            Close Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
