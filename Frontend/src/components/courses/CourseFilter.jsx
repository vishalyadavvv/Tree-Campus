import React from 'react';

const CourseFilter = ({ filters, setFilters }) => {
  const languages = [
    { id: 'all', label: 'All' },
    { id: 'En', label: 'English' },
    { id: 'Bn', label: 'Bengali' }
  ];

  return (
    <div className="flex flex-col items-center justify-center mb-10 space-y-4">
      <div className="flex items-center gap-3">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setFilters({ ...filters, lang: lang.id })}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
              filters.lang === lang.id
                ? 'bg-[#115E59] text-white shadow-lg shadow-teal-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseFilter;