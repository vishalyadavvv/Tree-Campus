import { createContext, useState } from "react";
import axios from 'axios';

// 👉 Create and export context
export const CourseContext = createContext();

// 👉 Create and export provider
export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setEnrolledCourses([]);
        return;
      }

      const response = await axios.get(`${API_URL}/enrollments/my-courses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.data) {
        setEnrolledCourses(response.data.data);
      } else if (Array.isArray(response.data)) {
        setEnrolledCourses(response.data);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  return (
    <CourseContext.Provider value={{ courses, setCourses, enrolledCourses, fetchEnrolledCourses }}>
      {children}
    </CourseContext.Provider>
  );
};
