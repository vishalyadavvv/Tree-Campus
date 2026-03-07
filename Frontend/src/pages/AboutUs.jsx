import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AboutUs = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-8 sm:p-12 mt-8 text-center sm:text-left">
        <div className="flex justify-center mb-8">
          <img 
            src="https://res.cloudinary.com/dtcaankcx/image/upload/v1764152899/tree_logo_c2dhe0.png" 
            alt="Tree Campus Logo" 
            className="h-24 md:h-32 object-contain"
          />
        </div>
        
        <div className="max-w-none text-gray-700 space-y-8">
          <section>
            <h1 className="text-3xl font-extrabold text-[#115E59] mb-4">Tree Campus</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Tree Campus is a digital platform that facilitates easy learning for all. Its service offerings of myriad learning tools and contents are made available free of cost to both teachers & students.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vision</h2>
            <p className="text-lg text-gray-600 italic leading-relaxed">
              "To actualise a world where education is easy, meaningful, affordable and available to all."
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission</h2>
            <p className="text-lg text-gray-600 italic leading-relaxed">
              "To make the journey of learning an easy one."
            </p>
          </section>

          <div className="flex justify-center pt-8">
            <Link 
              to={user ? "/courses" : "/register"}
              className="px-10 py-4 bg-[#115E59] text-white font-bold rounded-xl hover:bg-[#0F766E] transition-all transform hover:-translate-y-1 shadow-md hover:shadow-lg w-full sm:w-auto text-center"
            >
              {user ? "EXPLORE COURSES" : "START FOR FREE"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
