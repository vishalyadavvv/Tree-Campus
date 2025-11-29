// src/context/CourseContext.jsx

import { createContext, useState } from "react";

// 👉 Create and export context
export const CourseContext = createContext();

// 👉 Create and export provider
export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);

  return (
    <CourseContext.Provider value={{ courses, setCourses }}>
      {children}
    </CourseContext.Provider>
  );
};
