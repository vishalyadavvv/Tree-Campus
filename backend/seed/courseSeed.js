import mongoose from "mongoose";
import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";

const coursesData = [
  // Course 1: English Speaking
  {
    courseInfo: {
      title: "30-Day English Speaking Course",
      description: "Master English in 30 days with structured lessons",
      instructor: "John Doe",
      category: "All Levels", // Changed from "Language"
      level: "Beginner", // Changed from "beginner"
      duration: "30 days",
      thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
      rating: 4.8,
      enrollmentCount: 1250,
      isPublished: true
    },
    sections: [
      {
        title: "Introduction + Greetings",
        lessons: [
          { title: "Introduction", duration: "10:30", videoUrl: "https://www.youtube.com/live/j48k8EKaqJw?si=Yo6nJgTU1mdwbmxT" },
          { title: "Greeting Part 1", duration: "8:45", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Greeting Part 2", duration: "9:15", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Synopsis", duration: "5:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Word of the Day", duration: "3:10", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Quiz – Day 1",
          passingScore: 70,
          questions: [
            {
              questionText: "What is a greeting?",
              options: [
                { optionText: "Hello", isCorrect: true },
                { optionText: "Table", isCorrect: false },
                { optionText: "Chair", isCorrect: false },
                { optionText: "Book", isCorrect: false }
              ]
            }
          ]
        }
      },
      {
        title: "Parts of Speech & Conversation",
        lessons: [
          { title: "Parts of Speech", duration: "15:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Conversation", duration: "10:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Word of the Day", duration: "3:45", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Parts of Speech Importance", duration: "12:15", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Quiz – Day 2",
          passingScore: 70,
          questions: [
            {
              questionText: "Which is a noun?",
              options: [
                { optionText: "Apple", isCorrect: true },
                { optionText: "Run", isCorrect: false },
                { optionText: "Quickly", isCorrect: false },
                { optionText: "Beautiful", isCorrect: false }
              ]
            }
          ]
        }
      }
    ]
  },

  // Course 2: Web Development
  {
    courseInfo: {
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React, Node.js and become a full-stack developer",
      instructor: "Sarah Johnson",
      category: "Programming",
      level: "Beginner",
      duration: "12 weeks",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
      rating: 4.9,
      enrollmentCount: 3420,
      isPublished: true
    },
    sections: [
      {
        title: "HTML Fundamentals",
        lessons: [
          { title: "Introduction to HTML", duration: "12:00", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "HTML Tags & Elements", duration: "15:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Forms & Input", duration: "18:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Semantic HTML", duration: "14:45", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "HTML Fundamentals Quiz",
          passingScore: 75,
          questions: [
            {
              questionText: "What does HTML stand for?",
              options: [
                { optionText: "HyperText Markup Language", isCorrect: true },
                { optionText: "High Tech Modern Language", isCorrect: false },
                { optionText: "Home Tool Markup Language", isCorrect: false },
                { optionText: "Hyperlinks and Text Markup Language", isCorrect: false }
              ]
            }
          ]
        }
      },
      {
        title: "CSS Basics",
        lessons: [
          { title: "Introduction to CSS", duration: "10:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Selectors & Properties", duration: "16:15", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Flexbox Layout", duration: "20:00", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "CSS Grid", duration: "22:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "CSS Basics Quiz",
          passingScore: 75,
          questions: [
            {
              questionText: "Which property is used to change background color?",
              options: [
                { optionText: "background-color", isCorrect: true },
                { optionText: "bgcolor", isCorrect: false },
                { optionText: "color", isCorrect: false },
                { optionText: "background", isCorrect: false }
              ]
            }
          ]
        }
      }
    ]
  },

  // Course 3: Python Programming
  {
    courseInfo: {
      title: "Python for Beginners",
      description: "Learn Python programming from scratch with practical examples and projects",
      instructor: "Michael Chen",
      category: "Programming",
      level: "Beginner",
      duration: "8 weeks",
      thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
      rating: 4.7,
      enrollmentCount: 2890,
      isPublished: true
    },
    sections: [
      {
        title: "Python Basics",
        lessons: [
          { title: "Introduction to Python", duration: "11:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Variables & Data Types", duration: "14:50", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Operators", duration: "13:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Control Flow", duration: "17:15", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Python Basics Quiz",
          passingScore: 70,
          questions: [
            {
              questionText: "Which keyword is used to define a function in Python?",
              options: [
                { optionText: "def", isCorrect: true },
                { optionText: "function", isCorrect: false },
                { optionText: "func", isCorrect: false },
                { optionText: "define", isCorrect: false }
              ]
            }
          ]
        }
      },
      {
        title: "Data Structures",
        lessons: [
          { title: "Lists", duration: "16:40", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Tuples & Sets", duration: "15:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Dictionaries", duration: "18:00", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "List Comprehension", duration: "12:45", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Data Structures Quiz",
          passingScore: 70,
          questions: [
            {
              questionText: "Which data structure uses key-value pairs?",
              options: [
                { optionText: "Dictionary", isCorrect: true },
                { optionText: "List", isCorrect: false },
                { optionText: "Tuple", isCorrect: false },
                { optionText: "Set", isCorrect: false }
              ]
            }
          ]
        }
      }
    ]
  },

  // Course 4: Digital Marketing
  {
    courseInfo: {
      title: "Digital Marketing Masterclass",
      description: "Master SEO, Social Media, Email Marketing, and Analytics",
      instructor: "Emily Rodriguez",
      category: "Marketing",
      level: "Intermediate",
      duration: "10 weeks",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      rating: 4.6,
      enrollmentCount: 1890,
      isPublished: true
    },
    sections: [
      {
        title: "SEO Fundamentals",
        lessons: [
          { title: "Introduction to SEO", duration: "13:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Keyword Research", duration: "19:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "On-Page SEO", duration: "21:15", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Link Building", duration: "17:40", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "SEO Fundamentals Quiz",
          passingScore: 75,
          questions: [
            {
              questionText: "What does SEO stand for?",
              options: [
                { optionText: "Search Engine Optimization", isCorrect: true },
                { optionText: "Social Engine Optimization", isCorrect: false },
                { optionText: "Site Engine Optimization", isCorrect: false },
                { optionText: "Search Email Optimization", isCorrect: false }
              ]
            }
          ]
        }
      },
      {
        title: "Social Media Marketing",
        lessons: [
          { title: "Social Media Strategy", duration: "16:00", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Content Creation", duration: "18:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Facebook Ads", duration: "22:45", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Instagram Marketing", duration: "20:10", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Social Media Marketing Quiz",
          passingScore: 75,
          questions: [
            {
              questionText: "What is the ideal length for a tweet?",
              options: [
                { optionText: "Under 280 characters", isCorrect: true },
                { optionText: "Under 140 characters", isCorrect: false },
                { optionText: "Under 500 characters", isCorrect: false },
                { optionText: "Unlimited", isCorrect: false }
              ]
            }
          ]
        }
      }
    ]
  },

  // Course 5: Data Science
  {
    courseInfo: {
      title: "Data Science with Python",
      description: "Learn data analysis, visualization, machine learning and AI with Python",
      instructor: "Dr. James Wilson",
      category: "Data Science",
      level: "Advanced",
      duration: "16 weeks",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
      rating: 4.9,
      enrollmentCount: 2150,
      isPublished: true
    },
    sections: [
      {
        title: "Data Analysis with Pandas",
        lessons: [
          { title: "Introduction to Pandas", duration: "15:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Data Cleaning", duration: "20:45", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Data Manipulation", duration: "22:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Grouping & Aggregation", duration: "18:15", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Pandas Quiz",
          passingScore: 80,
          questions: [
            {
              questionText: "What is the main data structure in Pandas?",
              options: [
                { optionText: "DataFrame", isCorrect: true },
                { optionText: "Array", isCorrect: false },
                { optionText: "List", isCorrect: false },
                { optionText: "Dictionary", isCorrect: false }
              ]
            }
          ]
        }
      },
      {
        title: "Machine Learning Basics",
        lessons: [
          { title: "Introduction to ML", duration: "17:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Supervised Learning", duration: "24:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Linear Regression", duration: "26:15", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Model Evaluation", duration: "21:40", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Machine Learning Quiz",
          passingScore: 80,
          questions: [
            {
              questionText: "Which algorithm is used for classification?",
              options: [
                { optionText: "Logistic Regression", isCorrect: true },
                { optionText: "K-Means", isCorrect: false },
                { optionText: "PCA", isCorrect: false },
                { optionText: "Apriori", isCorrect: false }
              ]
            }
          ]
        }
      }
    ]
  },

  // Course 6: Graphic Design
  {
    courseInfo: {
      title: "Graphic Design Fundamentals",
      description: "Master Adobe Photoshop, Illustrator, and design principles",
      instructor: "Lisa Anderson",
      category: "Design",
      level: "Beginner",
      duration: "6 weeks",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
      rating: 4.8,
      enrollmentCount: 1670,
      isPublished: true
    },
    sections: [
      {
        title: "Design Principles",
        lessons: [
          { title: "Introduction to Design", duration: "12:00", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Color Theory", duration: "16:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Typography", duration: "18:45", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Composition", duration: "15:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Design Principles Quiz",
          passingScore: 70,
          questions: [
            {
              questionText: "What are the primary colors?",
              options: [
                { optionText: "Red, Yellow, Blue", isCorrect: true },
                { optionText: "Red, Green, Blue", isCorrect: false },
                { optionText: "Orange, Purple, Green", isCorrect: false },
                { optionText: "Black, White, Gray", isCorrect: false }
              ]
            }
          ]
        }
      },
      {
        title: "Adobe Photoshop",
        lessons: [
          { title: "Photoshop Interface", duration: "14:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Layers & Masks", duration: "19:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Photo Editing", duration: "22:15", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Advanced Techniques", duration: "25:40", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Photoshop Quiz",
          passingScore: 70,
          questions: [
            {
              questionText: "What is the shortcut for creating a new layer?",
              options: [
                { optionText: "Ctrl/Cmd + Shift + N", isCorrect: true },
                { optionText: "Ctrl/Cmd + N", isCorrect: false },
                { optionText: "Ctrl/Cmd + L", isCorrect: false },
                { optionText: "Ctrl/Cmd + Shift + L", isCorrect: false }
              ]
            }
          ]
        }
      }
    ]
  },

  // Course 7: Business Management
  {
    courseInfo: {
      title: "Business Management Essentials",
      description: "Learn core business principles, leadership, and strategic planning",
      instructor: "Robert Taylor",
      category: "Business",
      level: "Intermediate",
      duration: "8 weeks",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      rating: 4.5,
      enrollmentCount: 980,
      isPublished: true
    },
    sections: [
      {
        title: "Business Fundamentals",
        lessons: [
          { title: "Introduction to Business", duration: "14:00", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Business Models", duration: "17:30", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Market Analysis", duration: "19:45", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
          { title: "Competitive Strategy", duration: "16:20", videoUrl: "https://youtu.be/dQw4w9WgXcQ" },
        ],
        quiz: {
          title: "Business Fundamentals Quiz",
          passingScore: 75,
          questions: [
            {
              questionText: "What is a SWOT analysis?",
              options: [
                { optionText: "Strengths, Weaknesses, Opportunities, Threats", isCorrect: true },
                { optionText: "Sales, Work, Operations, Targets", isCorrect: false },
                { optionText: "Strategy, Workforce, Objectives, Technology", isCorrect: false },
                { optionText: "Systems, Workflow, Outcomes, Training", isCorrect: false }
              ]
            }
          ]
        }
      }
    ]
  }
];

(async () => {
  try {
    await mongoose.connect("mongodb+srv://vishaldgtldb:Ram%40123@cluster0.llotsdg.mongodb.net/TreeCampus?retryWrites=true&w=majority&appName=Cluster0");
    console.log("🚀 Connected to DB");

    // Delete old data
    await Course.deleteMany({});
    await Section.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    console.log("🗑 Old course, sections, lessons, quizzes deleted\n");

    // Loop through all courses
    for (const courseData of coursesData) {
      // Create course
      const course = await Course.create({
        ...courseData.courseInfo,
        totalSections: courseData.sections.length,
        totalLessons: courseData.sections.reduce((sum, sec) => sum + sec.lessons.length, 0)
      });
      console.log(`📘 Course created: ${course.title}`);

      // Loop through sections
      for (let i = 0; i < courseData.sections.length; i++) {
        const sec = courseData.sections[i];

        // Create section
        const section = await Section.create({
          title: sec.title,
          courseId: course._id,
          order: i + 1
        });
        console.log(`  📗 Section created: ${section.title}`);

        // Create lessons
        for (let j = 0; j < sec.lessons.length; j++) {
          const lessonData = sec.lessons[j];
          await Lesson.create({
            ...lessonData,
            courseId: course._id,
            sectionId: section._id,
            order: j + 1
          });
        }
        console.log(`     ➤ Added ${sec.lessons.length} lessons`);

        // Create quiz
        if (sec.quiz) {
          await Quiz.create({
            ...sec.quiz,
            courseId: course._id,
            sectionId: section._id
          });
          console.log(`     📝 Quiz added: ${sec.quiz.title}`);
        }
      }
      console.log(""); // Empty line for readability
    }

    console.log("✅ All courses seeding completed successfully");
    console.log(`📊 Total courses created: ${coursesData.length}`);
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();