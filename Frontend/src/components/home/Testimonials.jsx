import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const [stats, setStats] = useState({
    students: 0,
    rating: 0,
    certificates: 0,
    successRate: 0
  });
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer at TCS',
      image: 'https://i.pravatar.cc/150?img=1',
      text: 'I learned English completely free! The spoken English course helped me speak confidently in interviews. Now I work with international clients daily.',
      rating: 5,
      course: 'Free Spoken English Course',
      progress: 'Completed'
    },
    {
      name: 'Rahul Kumar',
      role: 'MBA Graduate',
      image: 'https://i.pravatar.cc/150?img=2',
      text: 'Best free English speaking course online! Within 2 months, I improved my fluency and landed my dream job. The daily practice sessions were game-changing.',
      rating: 5,
      course: 'English Speaking Mastery',
      progress: 'Completed'
    },
    {
      name: 'Anjali Verma',
      role: 'College Student',
      image: 'https://i.pravatar.cc/150?img=3',
      text: 'Learning English for free seemed impossible until I found this platform. The interactive lessons and AI practice made me fluent in just 3 months!',
      rating: 5,
      course: 'Complete English Course',
      progress: 'In Progress'
    },
    {
      name: 'Arjun Patel',
      role: 'Business Owner',
      image: 'https://i.pravatar.cc/150?img=4',
      text: 'This free English course transformed my business communication. I can now negotiate deals confidently and expand my business internationally.',
      rating: 5,
      course: 'Business English (Free)',
      progress: 'Completed'
    },
    {
      name: 'Neha Singh',
      role: 'Customer Support Executive',
      image: 'https://i.pravatar.cc/150?img=5',
      text: 'I was searching for free English speaking courses and found this gem. My pronunciation and confidence improved drastically. Highly recommended!',
      rating: 5,
      course: 'Spoken English Basics',
      progress: 'Completed'
    },
    {
      name: 'Vikram Reddy',
      role: 'IT Professional',
      image: 'https://i.pravatar.cc/150?img=6',
      text: 'The best part? Everything is absolutely free! From grammar to advanced conversation, this platform helped me master English speaking without spending a rupee.',
      rating: 5,
      course: 'Advanced English Speaking',
      progress: 'Completed'
    }
  ];

  const targetStats = {
    students: 75000,
    rating: 4.9,
    certificates: 25000,
    successRate: 96
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateStats();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const animateStats = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    Object.keys(targetStats).forEach((key) => {
      let currentStep = 0;
      const targetValue = targetStats[key];
      const startValue = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        let currentValue;

        if (key === 'rating') {
          currentValue = Number((startValue + (targetValue - startValue) * progress).toFixed(1));
        } else {
          currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        }

        setStats(prev => ({
          ...prev,
          [key]: currentValue
        }));

        if (currentStep === steps) {
          clearInterval(timer);
          setStats(prev => ({
            ...prev,
            [key]: targetValue
          }));
        }
      }, stepDuration);
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Learn English Free - Real Success Stories
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Join thousands who learned English speaking completely free and transformed their careers. 
            See how our free English courses changed their lives!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#14B8A6]"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 md:w-5 md:h-5 fill-[#14B8A6]"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm md:text-base text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3 md:gap-4 mb-4 pb-4 border-b border-gray-200">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-[#14B8A6]/20"
                />
                <div>
                  <div className="font-semibold text-sm md:text-base text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-[#14B8A6] font-medium">
                  {testimonial.course}
                </span>
                <span className="bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                  {testimonial.progress}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          ref={statsRef}
          className="bg-gradient-to-r from-[#14B8A6] to-[#22D3EE] rounded-2xl md:rounded-3xl p-6 md:p-12 mb-12 md:mb-16 shadow-2xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">
                {formatNumber(stats.students)}
              </div>
              <div className="text-teal-100 font-medium text-xs md:text-base">Students Learning Free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">
                {stats.rating}/5
              </div>
              <div className="text-teal-100 font-medium text-xs md:text-base">Course Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">
                {formatNumber(stats.certificates)}
              </div>
              <div className="text-teal-100 font-medium text-xs md:text-base">Free Certificates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">
                {stats.successRate}%
              </div>
              <div className="text-teal-100 font-medium text-xs md:text-base">Job Success Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-red-50 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center border-2 border-[#14B8A6]/20">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Ready to Start Your Success Story?
          </h3>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Join {formatNumber(targetStats.students)}+ students who learned English speaking completely free and transformed their careers
          </p>
          <Link to="/courses">
            <button className="bg-[#115E59] hover:bg-[#E55000] text-white font-semibold px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Start Learning Free →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;