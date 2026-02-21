import React from 'react';
import { Experience } from '../components/AITeacher/Experience';

const AITeacherPage = () => {
  return (
    <div className="relative w-full h-[calc(100dvh-110px)] bg-black overflow-hidden">
        {/* The Experience component handles the Canvas and full 3D UI */}
      <Experience />
    </div>
  );
};

export default AITeacherPage;
