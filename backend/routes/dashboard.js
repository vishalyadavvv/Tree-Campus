import express from 'express';
const router = express.Router();

router.get("/", (req, res) => {
  // Return mock dashboard data matching frontend structure
  const dashboardData = {
    enrolledCourses: [
      {
        _id: "1",
        title: "Spoken English Basics",
        progress: 65,
        totalLessons: 30,
        completedLessons: 19,
        instructor: { name: "Dr. Sarah Johnson" },
        thumbnail: "/images/courses/spoken-english.jpg",
        nextLesson: { _id: "l20", title: "Lesson 20: Phone Conversations" },
        category: "Speaking",
        slug: "spoken-english-basics",
      },
      {
        _id: "2",
        title: "Grammar Mastery",
        progress: 40,
        totalLessons: 25,
        completedLessons: 10,
        instructor: { name: "Prof. Michael Brown" },
        thumbnail: "/images/courses/grammar.jpg",
        nextLesson: { _id: "l11", title: "Lesson 11: Past Perfect Tense" },
        category: "Grammar",
        slug: "grammar-mastery",
      },
      {
        _id: "3",
        title: "Business Communication",
        progress: 20,
        totalLessons: 20,
        completedLessons: 4,
        instructor: { name: "Ms. Emily Davis" },
        thumbnail: "/images/courses/business.jpg",
        nextLesson: { _id: "l5", title: "Lesson 5: Email Writing" },
        category: "Professional",
        slug: "business-communication",
      },
    ],
    recentActivity: [
      {
        _id: "1",
        type: "lesson",
        title: "Lesson 19: Daily Conversations",
        date: "2 hours ago",
        link: "/courses/spoken-english-basics/lesson/19",
      },
      {
        _id: "2",
        type: "quiz",
        title: "Quiz: Present Tense",
        score: 85,
        date: "Yesterday",
        link: "/quiz/results/q123",
      },
      {
        _id: "3",
        type: "game",
        title: "Word Builder Game",
        score: 120,
        date: "2 days ago",
        link: "/games/word-builder",
      },
      {
        _id: "4",
        type: "achievement",
        title: "Earned 'Fast Learner' Badge",
        date: "3 days ago",
        link: "/profile/achievements",
      },
    ],
    weeklyProgress: [65, 70, 75, 80, 72, 85, 90],
    stats: {
      totalXP: 2450,
      currentStreak: 7,
      lessonsCompleted: 33,
      hoursLearned: 24,
      quizzesPassed: 12,
      rank: "Gold Learner",
    },
    upcomingTasks: [
      {
        _id: "1",
        title: "Complete Grammar Quiz",
        dueDate: "Today",
        priority: "high",
        link: "/quiz/grammar-quiz-1",
      },
      {
        _id: "2",
        title: "Watch Video: Idioms",
        dueDate: "Tomorrow",
        priority: "medium",
        link: "/courses/spoken-english-basics/lesson/21",
      },
      {
        _id: "3",
        title: "Speaking Practice Session",
        dueDate: "In 2 days",
        priority: "low",
        link: "/practice/speaking",
      },
    ],
    notifications: [
      { _id: "1", message: "New course available: IELTS Preparation", isRead: false },
      { _id: "2", message: "You achieved a 7-day streak!", isRead: false },
    ],
  };

  return res.json(dashboardData);
});

export default router;