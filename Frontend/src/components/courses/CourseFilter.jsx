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
            className={`px-10 py-3.5 rounded-full text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${
              filters.lang === lang.id
                ? 'bg-[#115E59] text-white shadow-xl shadow-teal-200/50'
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