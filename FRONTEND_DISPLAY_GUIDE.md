# 📍 Frontend - Text & PDF Display Locations

## 1️⃣ WHERE TO ADD TEXT & PDF - THE FORM MODAL

### Location: **LessonModal Component** (Lines 1190-1315)
When you click **"Add Lesson"** or **"Edit Lesson"**, this modal appears:

```
┌────────────────────────────────────────────────────┐
│ ✎ Add New Lesson                              [X]  │
├────────────────────────────────────────────────────┤
│                                                    │
│ Lesson Title *                                    │
│ [Enter title here_________________]              │
│                                                    │
│ Video URL *                                       │
│ [https://youtube.com/___________]               │
│ YouTube, Vimeo, or direct video URL             │
│                                                    │
│ Duration *                                        │
│ [45 mins or HH:MM________________]              │
│                                                    │
│ Description (Optional)                           │
│ [Brief description_______________]              │
│                                                    │
│ ✨ NEW ✨                                         │
│ Text Content (Optional) ← YOU ADD HERE            │
│ [Add your notes, lecture content____]            │
│ [Example: "Welcome to English..."]              │
│ [Can add up to several paragraphs]              │
│                                                    │
│ ✨ NEW ✨                                         │
│ Upload PDF (Optional) ← YOU UPLOAD HERE          │
│ [Choose File______] [Browse]                    │
│ ✓ document_name.pdf (Once selected)             │
│                                                    │
│ Additional Content (Optional)                    │
│ [Extra notes or resources_______]               │
│                                                    │
├────────────────────────────────────────────────────┤
│  [Save Lesson]  [Cancel]                        │
└────────────────────────────────────────────────────┘
```

---

## 2️⃣ WHERE THEY DISPLAY - LESSON CARDS

### Location: **Lesson Cards in Course Builder** (Lines 620-700)
After you save, your lesson appears as cards in the section:

```
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│ 1  Lesson Title          [✎][🗑]    │  │ 2  Another Lesson        [✎][🗑]    │
├─────────────────────────────────────┤  ├─────────────────────────────────────┤
│                                     │  │                                     │
│ ⏱ Duration: 45 mins                │  │ ⏱ Duration: 30 mins                │
│                                     │  │                                     │
│ 📹 Video                           │  │ 📹 Video                           │
│    https://youtube.com/watch...    │  │    https://vimeo.com/...           │
│    (Clickable - opens video)       │  │    (Clickable - opens video)       │
│                                     │  │                                     │
│ ✨ NEW - TEXT CONTENT APPEARS HERE ✨│  │ ✨ NEW - TEXT CONTENT APPEARS HERE ✨│
│ 📝 Text Preview Box:               │  │ 📝 Text Preview Box:               │
│    ┌─────────────────────────────┐ │  │    ┌─────────────────────────────┐ │
│    │ Welcome to English basics   │ │  │    │ Advanced pronunciation tips │ │
│    │ Learn the fundamentals...   │ │  │    │ How to speak clearly and...  │ │
│    └─────────────────────────────┘ │  │    └─────────────────────────────┘ │
│    (Blue background - max 2 lines) │  │    (Blue background - max 2 lines) │
│                                     │  │                                     │
│ ✨ NEW - PDF APPEARS HERE ✨        │  │ ✨ NEW - PDF APPEARS HERE ✨        │
│ 📄 Download PDF (Clickable)        │  │ 📄 Download PDF (Clickable)        │
│    English_Basics.pdf              │  │    Pronunciation_Guide.pdf         │
│    [Opens in new tab for download] │  │    [Opens in new tab for download] │
│                                     │  │                                     │
│ Brief description text goes here... │  │ Brief description text goes here... │
│                                     │  │                                     │
└─────────────────────────────────────┘  └─────────────────────────────────────┘
```

---

## 3️⃣ STEP-BY-STEP: HOW TO USE

### Step 1: Click "Add Lesson"
```
Course Builder Page
    ↓
[Add Lesson] Button (Blue) - Click it
    ↓
Modal Opens with Form
```

### Step 2: Fill in Basic Info
```
- Lesson Title: "English Basics"
- Video URL: "https://youtube.com/watch?v=..."
- Duration: "45 mins"
```

### Step 3: Add Text Content (NEW!)
```
Find the field labeled: "Text Content (Optional)"
Write your notes:
    "Welcome to English basics...
     Today we'll learn...
     Key points to remember..."
```

### Step 4: Upload PDF (NEW!)
```
Find the field labeled: "Upload PDF (Optional)"
Click: [Choose File]
Select your PDF from your computer
You'll see: ✓ filename.pdf
```

### Step 5: Save
```
Click: [Save Lesson]
Modal closes
Lesson card appears with all content
```

---

## 4️⃣ WHAT YOU'LL SEE IN THE CARD

### Video Section
```
📹 Video
   https://youtube.com/watch?v=dQw4w9WgXcQ
   (Red text, clickable link)
```

### Text Content Section (NEW!)
```
📝 Text Preview:
┌──────────────────────────────┐
│ Welcome to English basics... │
│ Learn the fundamentals of... │
└──────────────────────────────┘
(Blue background, shows first 2 lines only)
```

### PDF Section (NEW!)
```
📄 Download PDF
   lesson_notes.pdf
   (Red text, clickable link, downloads when clicked)
```

### Description
```
Brief description you added...
```

---

## 5️⃣ CODE LOCATIONS

### Where Text Input Field is Added
**File:** `CourseBuilder.jsx` → `LessonModal` Component
**Lines:** ~1250-1265

```jsx
{/* Text Content Input */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Text Content (Optional)
  </label>
  <textarea
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg..."
    value={formData.textContent}
    onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
    rows="3"
    placeholder="Add text notes, lecture content..."
  />
</div>
```

### Where PDF Upload Field is Added
**File:** `CourseBuilder.jsx` → `LessonModal` Component
**Lines:** ~1266-1285

```jsx
{/* PDF Upload Input */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Upload PDF (Optional)
  </label>
  <input
    type="file"
    accept=".pdf"
    onChange={handlePdfChange}
    className="w-full px-4 py-2.5 border..."
  />
  {formData.pdfFileName && (
    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
      <FiCheckCircle className="w-4 h-4" />
      <span>{formData.pdfFileName}</span>
    </div>
  )}
</div>
```

### Where Text is Displayed in Lesson Card
**File:** `CourseBuilder.jsx` → Lesson Cards Display
**Lines:** ~670-680

```jsx
{/* Text Content Preview */}
{lesson.textContent && (
  <div className="bg-blue-50 p-2 rounded-lg">
    <p className="text-gray-700 line-clamp-2">{lesson.textContent}</p>
  </div>
)}
```

### Where PDF Link is Displayed in Lesson Card
**File:** `CourseBuilder.jsx` → Lesson Cards Display
**Lines:** ~681-695

```jsx
{/* PDF Download Link */}
{lesson.pdfUrl && (
  <div>
    <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer"
       className="flex items-center space-x-1.5 text-red-600...">
      <FiFileText className="w-3 h-3" />
      <span className="truncate">{lesson.pdfFileName || 'Download PDF'}</span>
      <FiExternalLink className="w-2.5 h-2.5" />
    </a>
  </div>
)}
```

---

## 6️⃣ VISUAL FLOW

```
ADMIN SIDE (What Teacher/Admin sees):

1. Open Course Builder
2. Click "Add Lesson" 
   ↓
3. Modal Opens with Form
   ├─ Lesson Title input
   ├─ Video URL input
   ├─ Duration input
   ├─ Description textarea
   ├─ TEXT CONTENT textarea ← NEW
   ├─ PDF FILE UPLOAD input ← NEW
   └─ Additional Content
   ↓
4. Click "Save Lesson"
   ↓
5. Lesson Card Appears
   ├─ Shows Video Link
   ├─ Shows TEXT PREVIEW (in blue box) ← NEW
   ├─ Shows PDF DOWNLOAD LINK ← NEW
   └─ Shows Description
```

---

## 7️⃣ QUIZ SECTION (SMALLER NOW)

### Before:
```
┌──────────────────────────────────────┐
│ 📋 Quiz                              │
│ Add a quiz to test student knowledge │
│                                      │
│                       [+ Add Quiz]   │
│                                      │
│  Or if quiz exists:                 │
│  ⭕ Quiz Title                       │
│     5 Questions                      │
│     Passing Score: 80%               │
│     Time Limit: 30 mins              │
│                                      │
│     Quiz Description...              │
│              [Edit Quiz] [Delete]    │
│                                      │
└──────────────────────────────────────┘
Height: ~180px
```

### After (Compact):
```
┌────────────────────────────────────┐
│ 📋 Quiz        [+ Add Quiz]        │
├────────────────────────────────────┤
│ ⭕ Quiz Title    5Q                │
│    80% pass  30m                  │
│    Quiz Description...            │
│              [Edit] [Delete]      │
└────────────────────────────────────┘
Height: ~100px (44% smaller!)
```

---

## 8️⃣ COMPLETE LESSON CARD EXAMPLE

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│ 1  English Basics              [✎ Edit] [🗑 Delete]    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ⏱ Duration: 45 mins                                    │
│                                                         │
│ 📹 Video                                               │
│    https://youtube.com/watch?v=dQw4w9WgXcQ            │
│                                                         │
│ 📝 Text Content Preview:                               │
│ ┌───────────────────────────────────────────────────┐ │
│ │ Welcome to English basics! This lesson covers     │ │
│ │ fundamental concepts you need to know to get...   │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ 📄 Download PDF                                         │
│    English_Basics_Notes.pdf                            │
│                                                         │
│ Learn the basics of English language and improve      │
│ your communication skills.                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ FINAL SUMMARY

### In the Modal (Where You Add):
- ✏️ **Text Content Field** - Textarea for typing notes
- 📤 **PDF Upload Field** - File input to select PDF

### On the Card (Where It Shows):
- 📝 **Text Preview Box** - Blue box showing first 2 lines
- 📄 **PDF Link** - Clickable red link to download

### Quiz Below:
- 📋 **Compact Quiz Card** - Much smaller than before

**All in one file: `CourseBuilder.jsx`**

Ready to use! 🚀
