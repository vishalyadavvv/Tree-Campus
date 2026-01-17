import React from 'react';

const CourseFilter = ({ filters, setFilters }) => {
  const levels = {
    all: 'All Levels',
    // beginner: 'Beginner',
    // intermediate: 'Intermediate',
    // advanced: 'Advanced'
  };

  const categories = {
    all: 'All Categories',
    'spoken-english': 'Spoken English',
    'other': 'Other'
  };

  const languages = {
    all: 'All Languages',
    'Hn': 'Hindi',
    'Bn': 'Bengali',
    'En': 'English'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Filter Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Courses
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search by course name or description..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FD5A00] focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level
          </label>
          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FD5A00] focus:border-transparent transition-all duration-300"
          >
            {Object.entries(levels).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FD5A00] focus:border-transparent transition-all duration-300"
          >
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={filters.lang}
            onChange={(e) => setFilters({ ...filters, lang: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FD5A00] focus:border-transparent transition-all duration-300"
          >
            {Object.entries(languages).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;