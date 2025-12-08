# 🔧 Troubleshooting & Setup Guide - Text, PDF, Quiz Display

## ✅ FIXES APPLIED

### 1. ✅ Text Display Now Shows Full Content
- **Before**: Limited to 100 characters (line-clamp-3)
- **After**: Shows full text with "View Full" / "Show Less" toggle button
- **Location**: Sidebar in blue box (📖)

### 2. ✅ Quiz API Route Fixed
- **Before**: Called `/courses/sections/:id/quizzes` (wrong endpoint)
- **After**: Calls `/quizzes/section/:id` (correct endpoint)
- **Result**: Quizzes will now load and display

### 3. ✅ Expandable Text State Added
- New state: `expandedText` to track which lessons have expanded text
- Toggle button appears if text is longer than 100 characters
- Click "View Full" to see entire text
- Click "Show Less" to collapse

### 4. ✅ Video Player Preserved
- Large video player maintained (90vh height)
- No content below video that would compress it
- All details moved to sidebar only

---

## 🎯 EXPECTED BEHAVIOR NOW

### In Your Sidebar:

```
COURSE CONTENT
├─ Business Fundamentals
│  ├─ 1 Introduction to Business ← Click to view
│  │  ├─ 📖 Text: "Before I proceed... [View Full]"
│  │  └─ 📄 Best Personal Branding.pdf ↓
│  │
│  ├─ 2 Business Models
│  ├─ 3 Market Analysis
│  ├─ 4 Competitive Strategy
│  │
│  └─ ─────────────────────────
│     📋 Quiz 1: Basics (5 Q, 75%)
│     📋 Quiz 2: Review (3 Q, 80%)
│
└─ Other Sections...
```

---

## 🧪 HOW TO TEST

### Test 1: Text Content Display

**Step 1: Add text to a lesson**
1. Go to ADMIN → Course Builder
2. Edit "Introduction to Business" lesson (or any lesson)
3. Add text in "Text Content" field:
   ```
   Welcome to Introduction to Business!
   
   In this lesson, we'll cover:
   • Definition of business
   • Types of business organizations
   • Business environment factors
   
   Key Concepts to Remember...
   (Add more text here)
   ```
4. Save lesson

**Step 2: View in lesson player**
1. Go back to lesson player
2. Click on the lesson in sidebar
3. You should see in sidebar:
   - Blue box with 📖 icon
   - First 100 characters of text
   - If text > 100 chars, shows "[View Full]" button
   - Click button to expand and see all text

**Expected:**
```
📖 Welcome to Introduction to Business...
[View Full]
```

After clicking "View Full":
```
📖 Welcome to Introduction to Business!

In this lesson, we'll cover:
• Definition of business
• Types of business organizations
• Business environment factors

Key Concepts to Remember...
[Show Less]
```

---

### Test 2: PDF Display

**Step 1: Upload PDF**
1. In Course Builder, edit lesson
2. Click "Upload PDF"
3. Select a PDF file (< 20MB)
4. See green checkmark: ✓ filename.pdf
5. Save

**Step 2: View in lesson player**
1. Go to lesson player
2. Click lesson in sidebar
3. You should see:
   ```
   📄 filename.pdf ↓
   ```
4. Click to download/open in new tab

**Expected:** PDF link appears as clickable orange text in sidebar

---

### Test 3: Quizzes Display

**Step 1: Create a quiz**
1. Go to ADMIN → Course Builder
2. Scroll down to "Quiz" section
3. Click "+ Add Quiz"
4. Fill in:
   - Title: "Business Basics Quiz"
   - Questions: Add at least 1 question
   - Passing Score: 75
   - Save

**Step 2: View in lesson player**
1. Go to lesson player
2. Scroll down in sidebar (below lessons)
3. Look for divider line: `─────────────────`
4. Below that, see quiz:
   ```
   📋 Business Basics Quiz
      5 Qs • 75% pass
   ```

**Expected:** Quiz appears in purple card below lessons

---

## 🔍 DEBUGGING - If Quizzes Don't Show

### Check 1: Verify Quiz Was Created
1. Go to Course Builder
2. Look at the "Quiz" section
3. Do you see the quiz listed there?
   - **YES** → Continue to Check 2
   - **NO** → Create a quiz first

### Check 2: Verify API Response
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Refresh lesson player
4. Look for request: `quizzes/section/[id]`
5. Click on it
6. Check "Response" tab
   - Should show: `"data": [...]` with quiz objects
   - **If empty array `[]`**: Quiz not in database for this section
   - **If error**: API endpoint issue

### Check 3: Browser Console Errors
1. Open DevTools (F12)
2. Go to "Console" tab
3. Refresh page
4. Look for any red errors
5. Take a screenshot and check error message

### Check 4: Verify Section ID
1. In DevTools Console, paste:
   ```javascript
   document.location.href
   ```
2. Look at URL: `/lesson/[lessonId]`
3. The section should match the lesson's section

---

## 🛠️ COMMON ISSUES & FIXES

### Issue 1: Quizzes Don't Show

**Problem:** 
```
Quiz section in sidebar is empty or not visible
```

**Solution:**
1. Make sure quiz is added in Course Builder ✓
2. Check API route is correct: `/quizzes/section/:id` ✓
3. Refresh page (Ctrl+Shift+R - hard refresh)
4. Check browser console for errors
5. Verify quiz's sectionId matches section

**Check in MongoDB:**
```javascript
// Open MongoDB Compass
// Go to database → quizzes
// Look for: sectionId matches your section
```

---

### Issue 2: Text Shows Limited/Truncated

**Problem:** 
```
Text appears cut off even after clicking "View Full"
```

**Solution:**
1. Check text is actually saved in database
2. In MongoDB, check lesson.textContent field
3. If limited, text may have character limit
4. Update text to remove extra characters

---

### Issue 3: PDF Link Doesn't Work

**Problem:** 
```
PDF link shows but download doesn't work
```

**Solution:**
1. Verify PDF uploaded to Cloudinary
2. Check Cloudinary dashboard: https://cloudinary.com/console
3. Look for uploaded PDF files
4. If URL broken, re-upload PDF
5. Check pdfUrl in MongoDB is valid Cloudinary URL

---

### Issue 4: Large Text Makes Sidebar Scrolly

**Problem:** 
```
Too much text in sidebar, can't see other lessons
```

**Solution:**
This is normal for large text. Options:
1. **Default (Current)**: Text expands when opened
2. **Better**: Click "Show Less" to collapse
3. **Or**: Add text in sections, not all at once

---

## 📋 STEP-BY-STEP SETUP

### Complete Fresh Test:

**Step 1: Verify Backend API**
```bash
# Test quiz endpoint
curl -X GET "http://localhost:5000/api/quizzes/section/[SECTION_ID]" \
  -H "Authorization: Bearer [YOUR_TOKEN]"

# Should return: { "success": true, "data": [...] }
```

**Step 2: Create Test Content**
1. In Course Builder:
   - Add text: "This is test text content for the lesson"
   - Upload PDF: Any small PDF file
   - Add Quiz: Create quiz with 3 questions, 70% pass

**Step 3: View in Lesson Player**
1. Click on lesson
2. Open DevTools (F12)
3. Check Console for errors
4. Look in sidebar:
   - Should see blue box with 📖 and text
   - Should see orange link with 📄 and PDF name
   - Scroll down should see 📋 and quiz name

**Step 4: Test Interactions**
1. Click "View Full" on text → Should expand
2. Click "Show Less" → Should collapse
3. Click PDF link → Should open/download
4. Scroll past quizzes → Should see all content

---

## ✅ VERIFICATION CHECKLIST

- [ ] Text content shows in blue box with 📖
- [ ] Text shows first 100 characters
- [ ] "View Full" button appears if text > 100 chars
- [ ] Clicking "View Full" expands to full text
- [ ] "Show Less" button appears when expanded
- [ ] PDF shows as orange link with 📄
- [ ] PDF link is clickable and downloads
- [ ] Quiz appears in purple box with 📋
- [ ] Quiz shows question count and passing score
- [ ] Quiz description displays (if added)
- [ ] Divider line separates lessons from quizzes
- [ ] Video player stays large and not compressed
- [ ] All content only in sidebar, not below video
- [ ] Sidebar scrolls if needed for large content
- [ ] Mobile responsive on small screens

---

## 🚀 IF EVERYTHING WORKS

**Congratulations!** Your system is complete:

✅ Text content with "View Full" option
✅ PDF upload and download
✅ Section-based quizzes
✅ Everything in sidebar only
✅ Video player remains large
✅ Mobile responsive

---

## 📞 IF ISSUES PERSIST

### Gather Information:

1. **Screenshot of the issue**
   - Show what you see vs. what should appear

2. **Browser Console errors**
   - F12 → Console tab
   - Take screenshot of any red errors

3. **Network tab responses**
   - F12 → Network tab
   - Look for requests to `/quizzes/section/`
   - Check response data

4. **MongoDB data**
   - Verify lessons have textContent
   - Verify lessons have pdfUrl
   - Verify quizzes exist with correct sectionId

5. **Browser used**
   - Chrome/Firefox/Safari?
   - Version?

---

## 🎓 CODE CHANGES SUMMARY

### Files Modified:

**Frontend/src/pages/LessonView.jsx:**
1. Added `expandedText` state for tracking expanded text
2. Updated API call: `/quizzes/section/:id` (fixed endpoint)
3. Updated text display: Shows first 100 chars + "View Full" toggle
4. Quizzes display logic intact (now works with correct endpoint)

**Backend/controllers/quizController.js:**
1. Added `getSectionQuizzes` function (fetches all quizzes for section)

**Backend/routes/quizRoutes.js:**
1. Added route: `GET /section/:id` for fetching section quizzes

---

## 🔄 COMPLETE FLOW

```
Admin Creates Content:
├─ Add Text in Course Builder
│  └─ Saved to lesson.textContent
├─ Upload PDF in Course Builder
│  └─ Saved to Cloudinary, URL in lesson.pdfUrl
└─ Create Quiz in Course Builder
   └─ Saved with sectionId

Student Views Lesson:
├─ LessonView loads
├─ Fetches lessons from API
├─ Fetches quizzes via `/quizzes/section/:id`
├─ Organizes by section in sidebar
└─ Displays:
   ├─ 📖 Text (expandable with View Full)
   ├─ 📄 PDF (clickable link)
   └─ 📋 Quizzes (below lessons)
```

---

## ✨ YOU'RE ALL SET!

All systems are now:
✅ Connected
✅ Configured
✅ Ready to use

Just add content in Course Builder and it will automatically appear in the lesson player sidebar!

