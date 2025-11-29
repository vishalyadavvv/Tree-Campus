import React, { useState, useEffect, useRef } from 'react';

const Stats = () => {
  const [counters, setCounters] = useState({
    students: 0,
    lessons: 0,
    teachers: 0,
    certificates: 0
  });

  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  const targetStats = {
    students: 50000,
    lessons: 100,
    teachers: 15,
    certificates: 10000
  };

  const stats = [
    { 
      number: `${counters.students.toLocaleString()}+`, 
      label: 'Active Students', 
      color: 'text-white' 
    },
    { 
      number: `${counters.lessons}+`, 
      label: 'Lessons', 
      color: 'text-white' 
    },
    { 
      number: `${counters.teachers}+`, 
      label: 'Expert Teachers', 
      color: 'text-white' 
    },
    { 
      number: `${counters.certificates.toLocaleString()}+`, 
      label: 'Certificates Issued', 
      color: 'text-white' 
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (!hasAnimated) {
              setHasAnimated(true);
              animateCounters();
            }
          } else {
            // Reset visibility when element leaves viewport for both scroll directions
            setIsVisible(false);
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
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

  const animateCounters = () => {
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
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);

        setCounters(prev => ({
          ...prev,
          [key]: currentValue
        }));

        if (currentStep === steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });
  };

  return (
    <section ref={statsRef} className="py-16 bg-[#FC5A00] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center transition-all duration-700 ease-out"
              style={{
                transitionDelay: `${index * 200}ms`,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: isVisible ? 1 : 0
              }}
            >
              <div className={`text-4xl md:text-5xl font-bold text-white mb-2 transition-all duration-300`}>
                {stat.number}
              </div>
              <div className="text-white text-opacity-90 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;