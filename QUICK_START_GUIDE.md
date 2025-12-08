# Quick Start Guide - Text & PDF Feature

## How It Works

### 1. **Adding a Lesson with Text & PDF**

```
Click "Add Lesson" in Course Builder
     ↓
Fill out lesson form:
  - Lesson Title ✓
  - Video URL ✓
  - Duration ✓
  - Description (optional)
  - Text Content (NEW) ← Add notes/content here
  - Upload PDF (NEW) ← Select PDF file
  - Additional Content (optional)
     ↓
Click "Save Lesson"
     ↓
PDF uploaded to Cloudinary
Data saved to database
```

### 2. **What Students See**

Lesson Card displays:
```
┌─────────────────────────────────┐
│ 1. Lesson Title                 │
├─────────────────────────────────┤
│ ⏱ Duration: 45 mins             │
├─────────────────────────────────┤
│ 📹 Video URL (clickable)        │
├─────────────────────────────────┤
│ "Text content preview here..."  │
├─────────────────────────────────┤
│ 📄 Download PDF (clickable)     │
├─────────────────────────────────┤
│ Brief description...            │
└─────────────────────────────────┘
```

### 3. **Backend Storage**

```
Lesson Document:
{
  _id: "lesson123",
  title: "English Basics",
  videoUrl: "https://youtube.com/...",
  duration: "45 mins",
  textContent: "Welcome to English basics...",
  pdfUrl: "https://res.cloudinary.com/...",    ← Cloudinary URL
  pdfFileName: "English_Basics.pdf",
  ...
}
```

---

## File Structure

### Frontend Components Modified

**CourseBuilder.jsx** (Main file with 3 components):

1. **LessonModal Component** (Lines ~1190-1270)
   - Text input for textContent
   - File input for PDF upload
   - Validation for PDF files

2. **Lesson Cards Display** (Lines ~620-700)
   - Shows text preview in blue box
   - Shows PDF download link
   - Compact layout

3. **Quiz Section** (Lines ~730-810)
   - Reduced size by 40%
   - Still shows all important info
   - Fits nicely with lessons

### Backend Files Modified

1. **Lesson Model** (`models/Lesson.js`)
   - 3 new fields

2. **Course Controller** (`controllers/courseController.js`)
   - createLesson() - handles PDF upload
   - updateLesson() - handles PDF update

3. **Routes** (`routes/courseRoutes.js`)
   - Added uploadMiddleware to lesson routes

---

## API Usage Examples

### Create Lesson with PDF

```javascript
const formData = new FormData();
formData.append('title', 'English Basics');
formData.append('videoUrl', 'https://youtube.com/...');
formData.append('duration', '45 mins');
formData.append('textContent', 'Welcome to English basics...');
formData.append('pdf', pdfFile);  // File object

fetch('/api/courses/sections/sec123/lessons', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token'
  },
  body: formData
});
```

### Update Lesson with New PDF

```javascript
const formData = new FormData();
formData.append('title', 'Updated Title');
formData.append('textContent', 'Updated content...');
formData.append('pdf', newPdfFile);  // Optional

fetch('/api/courses/lessons/lesson123', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer token'
  },
  body: formData
});
```

---

## Size Comparison

### Quiz Section Before vs After

**Before (Large):**
- Padding: 24px (p-6)
- Title size: xl (20px)
- Button size: md with full text
- Empty space: py-8
- Total height: ~180px

**After (Compact):**
- Padding: 16px (p-4)
- Title size: lg (18px)
- Button size: sm with abbreviated text
- Empty space: py-4
- Total height: ~100px
- **Reduction: 44%**

### Lesson Card Before vs After

**Before (Regular):**
- Padding: 20px (p-5)
- Title size: base
- Spacing: space-y-3
- Icon size: h-4 w-4

**After (Compact):**
- Padding: 16px (p-4)
- Title size: sm
- Spacing: space-y-2
- Icon size: h-3 w-3
- **More compact, better fit**

---

## Configuration

### Upload Limits (from uploadMiddleware.js)
- Max file size: **20MB**
- Allowed formats: **pdf, jpg, jpeg, png, webp, gif**
- Storage: **Cloudinary**
- Folder: **treecampus/uploads**

### Text Content Limits
- Field type: **String (no limit)**
- Recommended: **Up to 5000 characters** (for UI performance)
- Stored: **In MongoDB**

---

## Error Handling

### Frontend Validation
1. ✅ PDF file type check
2. ✅ File size validation
3. ✅ Required field validation
4. ✅ Empty content handling

### Backend Validation
1. ✅ Section existence check
2. ✅ File upload handling via multer
3. ✅ Database save validation
4. ✅ Error response formatting

---

## Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Text Content | ✅ Added | Textarea field in modal |
| PDF Upload | ✅ Added | File input with validation |
| PDF Display | ✅ Added | Download link in cards |
| Text Preview | ✅ Added | Truncated to 2 lines |
| Quiz Compact | ✅ Reduced | 44% smaller layout |
| Cloudinary Store | ✅ Integrated | Secure URL storage |
| Data Persistence | ✅ Working | MongoDB storage |
| Responsive Design | ✅ Mobile Ready | Works on all devices |

---

## Testing the Feature

### Step 1: Create a New Lesson
1. Go to Course Builder
2. Click "Add Section" (if needed)
3. Click "Add Lesson"
4. Fill in fields including:
   - Text Content: "Add some sample text here"
   - Upload PDF: Select a PDF file
5. Click "Save Lesson"

### Step 2: Verify Display
1. Lesson card should show:
   - ✓ Text preview in blue box
   - ✓ PDF download link with filename
   - ✓ All other lesson info

### Step 3: Verify Backend
1. Check MongoDB - Lesson document should have:
   - textContent field populated
   - pdfUrl with Cloudinary link
   - pdfFileName with original filename

### Step 4: Test Edit
1. Click edit on the lesson
2. Modal should show:
   - ✓ Text content in textarea
   - ✓ PDF filename shown
3. Update text and/or upload new PDF
4. Save and verify changes

---

## Troubleshooting

### PDF Not Uploading
- Check file size (max 20MB)
- Check file type (must be PDF)
- Check Cloudinary credentials in backend
- Check browser console for errors

### Text Not Showing
- Check text length (very long text may cause display issues)
- Check MongoDB for data in textContent field
- Clear browser cache

### Quiz Section Overlap
- Quiz section should appear below lessons
- If overlapping, check CSS cascade
- Refresh page to reload styles

---

## Next Development Steps

1. **Rich Text Editor** for text content (Quill, TinyMCE)
2. **Multiple PDFs** - allow multiple files per lesson
3. **PDF Preview** - embed PDF viewer for students
4. **Drag & Drop** - improve file upload UX
5. **File Management** - show upload date, size, etc.

---

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs for file upload issues
3. Verify Cloudinary account and credentials
4. Check MongoDB for data persistence

---

**Ready to use! 🚀**
