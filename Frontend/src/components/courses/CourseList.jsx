import React from 'react';
import CourseCard from './CourseCard';

const CourseList = ({ courses, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100">
            <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
            <div className="bg-gray-200 h-6 rounded mb-3"></div>
            <div className="bg-gray-200 h-4 rounded mb-4"></div>
            <div className="bg-gray-200 h-10 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-600 mb-2">No courses found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;