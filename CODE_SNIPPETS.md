# Code Snippets Reference

## 🎯 Key Code Changes

### Backend: Lesson Model (lesson.js)
```javascript
// ADD TO LESSON SCHEMA
textContent: {
  type: String,
  default: ''
},
pdfUrl: {
  type: String,
  default: ''
},
pdfFileName: {
  type: String,
  default: ''
}
```

### Backend: Create Lesson (courseController.js)
```javascript
export const createLesson = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    // If a file was uploaded via multer/uploadMiddleware
    const pdfUrl = req.file ? req.file.path : '';
    const pdfFileName = req.file ? req.file.originalname : '';

    const lesson = await Lesson.create({
      title: req.body.title,
      videoUrl: req.body.videoUrl,
      duration: req.body.duration,
      description: req.body.description || '',
      content: req.body.content || '',
      textContent: req.body.textContent || '',  // NEW
      pdfUrl,                                    // NEW
      pdfFileName,                               // NEW
      sectionId: req.params.id,
      courseId: section.courseId
    });

    const totalLessons = await Lesson.countDocuments({ courseId: section.courseId });
    await Course.findByIdAndUpdate(section.courseId, { totalLessons });

    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Backend: Update Lesson (courseController.js)
```javascript
export const updateLesson = async (req, res) => {
  try {
    let updateData = {
      title: req.body.title,
      videoUrl: req.body.videoUrl,
      duration: req.body.duration,
      description: req.body.description || '',
      content: req.body.content || '',
      textContent: req.body.textContent || ''  // NEW
    };

    // If a new file was uploaded
    if (req.file) {
      updateData.pdfUrl = req.file.path;
      updateData.pdfFileName = req.file.originalname;
    }

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Backend: Updated Routes (courseRoutes.js)
```javascript
import uploadMiddleware from '../middleware/uploadMiddleware.js';

// CREATE: With PDF upload
router.route('/sections/:id/lessons')
  .get(getSectionLessons)
  .post(protect, adminOnly, uploadMiddleware.single('pdf'), createLesson);

// UPDATE: With optional PDF upload
router.route('/lessons/:id')
  .put(protect, adminOnly, uploadMiddleware.single('pdf'), updateLesson)
  .delete(protect, adminOnly, deleteLesson);
```

---

### Frontend: LessonModal Component (CourseBuilder.jsx)
```javascript
const LessonModal = ({ lesson, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    videoUrl: lesson?.videoUrl || '',
    duration: lesson?.duration || '',
    description: lesson?.description || '',
    content: lesson?.content || '',
    textContent: lesson?.textContent || '',         // NEW
    pdfUrl: lesson?.pdfUrl || '',                   // NEW
    pdfFileName: lesson?.pdfFileName || ''          // NEW
  });
  const [pdfFile, setPdfFile] = useState(null);     // NEW
  const [uploadingPdf, setUploadingPdf] = useState(false); // NEW

  // NEW: Handle PDF file selection
  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setFormData({ ...formData, pdfFileName: file.name });
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...lesson, ...formData };
    if (pdfFile) {
      submitData.pdfFile = pdfFile;  // NEW
    }
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {lesson?._id ? 'Edit Lesson' : 'Add New Lesson'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Your Lesson Name"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL *
              </label>
              <input
                type="url"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                required
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                placeholder="e.g., 45 mins"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="2"
                placeholder="Brief description..."
              />
            </div>

            {/* NEW: Text Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content (Optional)
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                rows="3"
                placeholder="Add text notes, lecture content, or additional information..."
              />
            </div>

            {/* NEW: PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF (Optional)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.pdfFileName && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                  <FiCheckCircle className="w-4 h-4" />
                  <span>{formData.pdfFileName}</span>
                </div>
              )}
            </div>

            {/* Additional Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Content (Optional)
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="2"
                placeholder="Additional notes or resources..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 flex items-center justify-center space-x-2"
            >
              <FiSave className="w-4 h-4" />
              <span>Save Lesson</span>
            </button>
            <button
              type="button"
              className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

### Frontend: handleSaveLesson (CourseBuilder.jsx)
```javascript
const handleSaveLesson = async (lessonData) => {
  try {
    const formData = new FormData();
    formData.append('title', lessonData.title);
    formData.append('videoUrl', lessonData.videoUrl);
    formData.append('duration', lessonData.duration);
    formData.append('description', lessonData.description || '');
    formData.append('content', lessonData.content || '');
    formData.append('textContent', lessonData.textContent || '');  // NEW

    // Add PDF file if present
    if (lessonData.pdfFile) {  // NEW
      formData.append('pdf', lessonData.pdfFile);
    }

    if (lessonData._id) {
      await api.put(`/courses/lessons/${lessonData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      await api.post(`/courses/sections/${currentSectionId}/lessons`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    await fetchCourseStructure();
    setShowLessonModal(false);
    setEditingLesson(null);
    setCurrentSectionId(null);
  } catch (error) {
    console.error('Error saving lesson:', error);
    alert(error.response?.data?.message || 'Failed to save lesson');
  }
};
```

### Frontend: Lesson Card with Text & PDF (CourseBuilder.jsx)
```javascript
{section.lessons && section.lessons.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {section.lessons.map((lesson, lessonIndex) => (
      <div
        key={lesson._id}
        className="bg-white rounded-xl border border-blue-200 p-4 hover:shadow-lg"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold">
                  {lessonIndex + 1}
                </span>
                <h5 className="font-bold text-gray-900 text-sm">
                  {lesson.title}
                </h5>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => handleEditLesson(lesson, section._id)}>
                  <FiEdit2 className="w-3 h-3" />
                </button>
                <button onClick={() => handleDeleteLesson(lesson._id)}>
                  <FiTrash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {lesson.duration && (
                <div className="flex items-center space-x-1.5 text-gray-600">
                  <FiClock className="w-3 h-3" />
                  <span>{lesson.duration}</span>
                </div>
              )}

              {lesson.videoUrl && (
                <div>
                  <div className="flex items-center space-x-1 text-gray-500 mb-0.5">
                    <FiYoutube className="w-3 h-3" />
                    <span className="font-medium">Video</span>
                  </div>
                  <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer"
                     className="text-blue-600 hover:underline truncate block flex items-center space-x-1">
                    <span>{lesson.videoUrl.substring(0, 30)}...</span>
                    <FiExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}

              {/* NEW: Text Content Preview */}
              {lesson.textContent && (
                <div className="bg-blue-50 p-2 rounded-lg">
                  <p className="text-gray-700 line-clamp-2">{lesson.textContent}</p>
                </div>
              )}

              {/* NEW: PDF Download Link */}
              {lesson.pdfUrl && (
                <div>
                  <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer"
                     className="flex items-center space-x-1.5 text-red-600 hover:underline">
                    <FiFileText className="w-3 h-3" />
                    <span className="truncate">{lesson.pdfFileName || 'Download PDF'}</span>
                    <FiExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}

              {lesson.description && (
                <p className="text-gray-600 line-clamp-1">{lesson.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  /* Empty state */
)}
```

---

## 📦 Complete Request/Response Examples

### Create Lesson Request
```javascript
POST /api/courses/sections/section123/lessons

FormData:
- title: "English Basics"
- videoUrl: "https://youtube.com/watch?v=abc123"
- duration: "45 mins"
- description: "Introduction to English"
- content: "This is content"
- textContent: "Learn English basics from scratch"
- pdf: [File Object - lesson.pdf]
```

### Create Lesson Response
```json
{
  "success": true,
  "data": {
    "_id": "lesson123",
    "title": "English Basics",
    "videoUrl": "https://youtube.com/watch?v=abc123",
    "duration": "45 mins",
    "description": "Introduction to English",
    "content": "This is content",
    "textContent": "Learn English basics from scratch",
    "pdfUrl": "https://res.cloudinary.com/tree/raw/upload/v123/lesson.pdf",
    "pdfFileName": "lesson.pdf",
    "sectionId": "section123",
    "courseId": "course123",
    "isFree": false,
    "resources": [],
    "createdAt": "2025-12-06T10:30:00Z",
    "updatedAt": "2025-12-06T10:30:00Z"
  }
}
```

### Update Lesson Request (with new PDF)
```javascript
PUT /api/courses/lessons/lesson123

FormData:
- title: "English Basics - Updated"
- videoUrl: "https://youtube.com/watch?v=abc123"
- duration: "50 mins"
- textContent: "Updated content with more details"
- pdf: [File Object - lesson_updated.pdf]
```

### Update Lesson Response
```json
{
  "success": true,
  "data": {
    "_id": "lesson123",
    "title": "English Basics - Updated",
    "videoUrl": "https://youtube.com/watch?v=abc123",
    "duration": "50 mins",
    "textContent": "Updated content with more details",
    "pdfUrl": "https://res.cloudinary.com/tree/raw/upload/v456/lesson_updated.pdf",
    "pdfFileName": "lesson_updated.pdf",
    "updatedAt": "2025-12-06T10:45:00Z"
  }
}
```

---

**Ready to implement! 🚀**
