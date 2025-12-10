# Admin Login Issue - Fix Required

## 🔴 **PROBLEM IDENTIFIED**

**Admin login is NOT working** because:

1. ✅ Frontend **collects** the role (admin/student)
2. ❌ Frontend **doesn't send** role to backend
3. ❌ Backend **doesn't validate** role match

---

## 📍 **Issue Location:**

### **Frontend (Login.jsx - Line 151):**
```javascript
const result = await login(formData.email, formData.password);
//                         ❌ NOT sending formData.role!
```

The `formData` has role, but the `login()` function only accepts email and password!

### **Backend (authController.js - Lines 159-242):**
```javascript
const login = async (req, res, next) => {
  const { email, password } = req.body;
  // ❌ NOT reading or validating role!
  
  const user = await User.findOne({ email });
  // ❌ NOT checking if user.role matches requested role
}
```

---

## ✅ **SOLUTION**

### **Step 1: Update AuthContext to accept role**

**File:** `Frontend/src/context/AuthContext.jsx`

**Line 82 - Change:**
```javascript
const login = async (email, password) => {
```

**To:**
```javascript
const login = async (email, password, role) => {
```

**Line 87 - Change:**
```javascript
const response = await authService.login(email, password);
```

**To:**
```javascript
const response = await authService.login(email, password, role);
```

---

### **Step 2: Update authService to send role**

**File:** `Frontend/src/services/authService.js`

Find the `login` function and update it:

**Change:**
```javascript
login: async (email, password) => {
  return api.post('/auth/login', { email, password });
}
```

**To:**
```javascript
login: async (email, password, role) => {
  return api.post('/auth/login', { email, password, role });
}
```

---

### **Step 3: Update Login.jsx to pass role**

**File:** `Frontend/src/components/auth/Login.jsx`

**Line 151 - Change:**
```javascript
const result = await login(formData.email, formData.password);
```

**To:**
```javascript
const result = await login(formData.email, formData.password, formData.role);
```

---

### **Step 4: Update Backend to validate role**

**File:** `backend/controllers/authController.js`

**Lines 159-196 - Replace the login function with:**

```javascript
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body; // ⭐ ADD role

    // Validate request
    if (!role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please select a role' 
      });
    }

    // ⭐ POPULATE ALL USER DATA INCLUDING COURSES AND LESSONS
    const user = await User.findOne({ email })
      .select('+password')
      .populate({
        path: 'enrolledCourses.courseId',
        select: 'title thumbnail category'
      })
      .populate({
        path: 'completedLessons.lessonId',
        select: 'title'
      })
      .populate('certificates');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // ⭐ CHECK ROLE MATCH
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ 
        success: false, 
        message: `You are registered as ${user.role}, not as ${role}. Please select the correct role.` 
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email first' 
      });
    }

    user.role = user.role.toLowerCase();
    const tokens = generateTokens(user._id);

    // Remove sensitive fields
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.otp;
    delete userObject.otpExpiry;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpiry;

    console.log('✅ Login successful, sending user data:', {
      id: userObject._id,
      email: userObject.email,
      role: userObject.role, // ⭐ LOG ROLE
      enrolledCoursesCount: userObject.enrolledCourses?.length || 0,
      completedLessonsCount: userObject.completedLessons?.length || 0
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: userObject._id,
          name: userObject.name,
          email: userObject.email,
          role: userObject.role,
          isVerified: userObject.isVerified,
          phone: userObject.phone,
          createdAt: userObject.createdAt,
          updatedAt: userObject.updatedAt,
          profilePicture: userObject.profilePicture || '',
          enrolledCourses: userObject.enrolledCourses || [],
          completedLessons: userObject.completedLessons || [],
          certificates: userObject.certificates || [],
        },
        ...tokens,
      },
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};
```

---

## 🔍 **What This Fixes:**

1. ✅ **Frontend sends role** to backend
2. ✅ **Backend validates role** matches database
3. ✅ **Clear error message** if wrong role selected
4. ✅ **Security improved** - can't login with wrong role

---

## ⚠️ **Example Error Messages:**

- Student tries to login as Admin:
  ```
  "You are registered as student, not as admin. Please select the correct role."
  ```

- Admin tries to login as Student:
  ```
  "You are registered as admin, not as student. Please select the correct role."
  ```

---

## 🧪 **Testing:**

1. **Test Admin Login:**
   - Email: admin@treecampus.com
   - Role: Admin
   - Should: Navigate to `/admin`

2. **Test Student Login:**
   - Email: student@example.com
   - Role: Student
   - Should: Navigate to `/dashboard`

3. **Test Wrong Role:**
   - Email: admin@treecampus.com
   - Role: Student
   - Should: Show error message

---

## 📝 **Summary:**

The issue is that the **role is collected but not validated**. The fix requires:
1. Passing role from frontend
2. Validating role in backend
3. Showing proper error messages

**Would you like me to make these changes now?**
