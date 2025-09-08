// Import required modules
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client.db('school');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Authentication endpoint - Updated for original schema
app.post('/api/login', async (req, res) => {
  const { userId, role, accessCode } = req.body;
  
  if (!userId || !role) {
    return res.status(400).json({ message: 'User ID and role are required' });
  }
  
  try {
    const db = await connectToDatabase();
    let user = null;
    
    if (role === 'Admin') {
      // Admin login with schoolName and accessCode
      if (!accessCode) {
        return res.status(400).json({ message: 'Access code is required for admin login' });
      }
      
      const adminCollection = db.collection('admins');
      user = await adminCollection.findOne({ 
        schoolName: userId,
        accessCode: accessCode 
      });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid school name or access code' });
      }
    } else if (role === 'Student') {
      // Student login with schoolId
      const studentCollection = db.collection('students');
      user = await studentCollection.findOne({ schoolId: userId });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid student ID' });
      }
    } else if (role === 'Teacher') {
      // Teacher login with teacherId
      const teacherCollection = db.collection('teachers');
      user = await teacherCollection.findOne({ teacherId: userId });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid teacher ID' });
      }
    } else if (role === 'Secretary') {
      // Secretary login with secretaryId
      const secretaryCollection = db.collection('secretaries');
      user = await secretaryCollection.findOne({ secretaryId: userId });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid secretary ID' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        _id: user._id.toString(),
        role: role,
        name: user.name,
        email: user.email,
        school: user.school ? user.school.toString() : user._id.toString(),
        schoolName: user.schoolName || 'School'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );
    
    // Return user data and token
    res.json({
      token,
      user: {
        _id: user._id,
        role: role,
        name: user.name,
        email: user.email,
        schoolName: user.schoolName,
        schoolId: user.schoolId || user.teacherId || user.secretaryId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Get student information - Updated for original schema
app.get('/api/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentCollection = db.collection('students');
    
    const student = await studentCollection.findOne({ schoolId: req.params.studentId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Populate class information
    if (student.sclassName) {
      const classCollection = db.collection('sclasses');
      const studentClass = await classCollection.findOne({ _id: student.sclassName });
      if (studentClass) {
        student.sclass = studentClass;
        // Add subjects count for the dashboard
        student.subjectsCount = studentClass.subjects ? studentClass.subjects.length : 0;
      }
    }

    // Populate school information
    if (student.school) {
      const schoolCollection = db.collection('schools');
      const studentSchool = await schoolCollection.findOne({ _id: student.school });
      if (studentSchool) {
        student.schoolInfo = studentSchool;
      }
    }
    
    // Populate subjects if the student has exam results
    if (student.examResult && student.examResult.length > 0) {
      const subjectsCollection = db.collection('subjects');
      const subjectIds = student.examResult.map(result => result.subject);
      
      if (subjectIds.length > 0) {
        const subjects = await subjectsCollection.find({
          _id: { $in: subjectIds }
        }).toArray();
        
        // Map subjects back to exam results
        student.examResult = student.examResult.map(result => {
          const subject = subjects.find(sub => sub._id.toString() === result.subject.toString());
          return {
            ...result,
            subject: subject || { subName: 'Unknown Subject', subCode: 'N/A' }
          };
        });
      }
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student attendance records - Updated for original schema
app.get('/api/attendance/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentCollection = db.collection('students');
    
    const student = await studentCollection.findOne({ schoolId: req.params.studentId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student.attendance || []);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student exam results - Updated for original schema
app.get('/api/exam-results/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentCollection = db.collection('students');
    
    const student = await studentCollection.findOne({ schoolId: req.params.studentId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student.examResult || []);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student subjects - Updated for original schema
app.get('/api/student-subjects/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentCollection = db.collection('students');
    
    const student = await studentCollection.findOne({ schoolId: req.params.studentId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
          // Get the student's class to find subjects
      if (student.sclassName) {
        const classCollection = db.collection('sclasses');
        const studentClass = await classCollection.findOne({ _id: student.sclassName });
        
        if (studentClass && studentClass.subjects) {
          // Get the actual subject documents
          const subjectsCollection = db.collection('subjects');
          const subjects = await subjectsCollection.find({
            _id: { $in: studentClass.subjects }
          }).toArray();
          
          res.json(subjects);
        } else {
          res.json([]);
        }
      } else {
        res.json([]);
      }
  } catch (error) {
    console.error('Error fetching student subjects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get notices - Updated for original schema
app.get('/api/notices', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const noticesCollection = db.collection('notices');
    
    const notices = await noticesCollection.find({ school: new ObjectId(req.user.school) })
      .sort({ date: -1 })
      .toArray();
    
    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get classes - Updated for original schema
app.get('/api/classes', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const classesCollection = db.collection('sclasses');
    
    const classes = await classesCollection.find({ school: new ObjectId(req.user.school) })
      .sort({ sclassName: 1 })
      .toArray();
    
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student's class details - New endpoint
app.get('/api/student-class-details/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentId = req.params.studentId;
    
    // First get the student to find their class
    const student = await db.collection('students').findOne({ schoolId: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    if (!student.sclassName) {
      return res.status(404).json({ message: 'Student not assigned to any class' });
    }
    
    // Get class information
    const classCollection = db.collection('sclasses');
    const classInfo = await classCollection.findOne({ _id: student.sclassName });
    
    if (!classInfo) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Get all students in this class
    const studentsCollection = db.collection('students');
    const students = await studentsCollection.find({ 
      sclassName: student.sclassName 
    }).toArray();
    
    // Get all teachers for this class (from subjects)
    let teachers = [];
    if (classInfo.subjects && classInfo.subjects.length > 0) {
      const subjectsCollection = db.collection('subjects');
      const subjects = await subjectsCollection.find({
        _id: { $in: classInfo.subjects }
      }).toArray();
      
      // Get unique teachers from subjects
      const teacherIds = [...new Set(subjects.map(subject => subject.teacher).filter(Boolean))];
      
      if (teacherIds.length > 0) {
        const teachersCollection = db.collection('teachers');
        teachers = await teachersCollection.find({
          _id: { $in: teacherIds }
        }).toArray();
      }
    }
    
    // Get subjects for this class
    let subjects = [];
    if (classInfo.subjects && classInfo.subjects.length > 0) {
      const subjectsCollection = db.collection('subjects');
      subjects = await subjectsCollection.find({
        _id: { $in: classInfo.subjects }
      }).toArray();
    }
    
    // Combine all information
    const classDetails = {
      ...classInfo,
      students: students,
      teachers: teachers,
      subjects: subjects,
      studentsCount: students.length,
      teachersCount: teachers.length,
      subjectsCount: subjects.length
    };
    
    res.json(classDetails);
  } catch (error) {
    console.error('Error fetching student class details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get class details with students and teachers - New endpoint
app.get('/api/class-details/:classId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const classId = req.params.classId;
    
    // Get class information
    const classCollection = db.collection('sclasses');
    const classInfo = await classCollection.findOne({ _id: new ObjectId(classId) });
    
    if (!classInfo) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Get all students in this class
    const studentsCollection = db.collection('students');
    const students = await studentsCollection.find({ 
      sclassName: new ObjectId(classId) 
    }).toArray();
    
    // Get all teachers for this class (from subjects)
    let teachers = [];
    if (classInfo.subjects && classInfo.subjects.length > 0) {
      const subjectsCollection = db.collection('subjects');
      const subjects = await subjectsCollection.find({
        _id: { $in: classInfo.subjects }
      }).toArray();
      
      // Get unique teachers from subjects
      const teacherIds = [...new Set(subjects.map(subject => subject.teacher).filter(Boolean))];
      
      if (teacherIds.length > 0) {
        const teachersCollection = db.collection('teachers');
        teachers = await teachersCollection.find({
          _id: { $in: teacherIds }
        }).toArray();
      }
    }
    
    // Get subjects for this class
    let subjects = [];
    if (classInfo.subjects && classInfo.subjects.length > 0) {
      const subjectsCollection = db.collection('subjects');
      subjects = await subjectsCollection.find({
        _id: { $in: classInfo.subjects }
      }).toArray();
    }
    
    // Combine all information
    const classDetails = {
      ...classInfo,
      students: students,
      teachers: teachers,
      subjects: subjects,
      studentsCount: students.length,
      teachersCount: teachers.length,
      subjectsCount: subjects.length
    };
    
    res.json(classDetails);
  } catch (error) {
    console.error('Error fetching class details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get subjects - Updated for original schema
app.get('/api/subjects', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const subjectsCollection = db.collection('subjects');
    
    const subjects = await subjectsCollection.find({ school: new ObjectId(req.user.school) })
      .sort({ subName: 1 })
      .toArray();
    
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get media - Updated for original schema
app.get('/api/media', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const mediaCollection = db.collection('media');
    
    const media = await mediaCollection.find({ adminId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student payments - Updated for original schema
app.get('/api/student-payments/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const paymentsCollection = db.collection('payments');
    
    const payments = await paymentsCollection.find({ student: req.params.studentId })
      .sort({ date: -1 })
      .toArray();
    
    res.json(payments);
  } catch (error) {
    console.error('Error fetching student payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update student information - Updated for original schema
app.put('/api/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentCollection = db.collection('students');
    
    const studentId = req.params.studentId;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.schoolId;
    delete updateData.school;
    
    const result = await studentCollection.updateOne(
      { schoolId: studentId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const updatedStudent = await studentCollection.findOne({ schoolId: studentId });
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add attendance record - Updated for original schema
app.post('/api/attendance/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentCollection = db.collection('students');
    
    const studentId = req.params.studentId;
    const { date, status, subName } = req.body;
    
    const attendanceRecord = {
      date: new Date(date),
      status: status,
      subName: new ObjectId(subName)
    };
    
    const result = await studentCollection.updateOne(
      { schoolId: studentId },
      { $push: { attendance: attendanceRecord } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(201).json({ message: 'Attendance record added successfully' });
  } catch (error) {
    console.error('Error adding attendance record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add exam result - Updated for original schema
app.post('/api/exam-result/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentCollection = db.collection('students');
    
    const studentId = req.params.studentId;
    const { subName, marksObtained } = req.body;
    
    const examResult = {
      subName: new ObjectId(subName),
      marksObtained: {
        beginning: marksObtained.beginning || 0,
        midTerm: marksObtained.midTerm || 0,
        endTerm: marksObtained.endTerm || 0,
        weekendWork: marksObtained.weekendWork || 0,
        holidayPackage: marksObtained.holidayPackage || 0
      }
    };
    
    const result = await studentCollection.updateOne(
      { schoolId: studentId },
      { $push: { examResult: examResult } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(201).json({ message: 'Exam result added successfully' });
  } catch (error) {
    console.error('Error adding exam result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student report cards - Updated for original schema
app.get('/api/report-cards/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const reportCardCollection = db.collection('reportcards');
    
    const studentId = req.params.studentId;
    
    // First get the student to find their ObjectId
    const student = await db.collection('students').findOne({ schoolId: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const reportCards = await reportCardCollection.find({ 
      student: student._id,
      status: "Published"
    })
    .sort({ createdAt: -1 })
    .toArray();
    
    // Manually populate the data since .populate() is not available in native MongoDB driver
    const populatedReportCards = await Promise.all(reportCards.map(async (reportCard) => {
      // Populate sclass
      if (reportCard.sclass) {
        const sclass = await db.collection('sclasses').findOne({ _id: reportCard.sclass });
        reportCard.sclass = sclass;
      }
      
      // Populate subjects
      if (reportCard.subjects && Array.isArray(reportCard.subjects)) {
        reportCard.subjects = await Promise.all(reportCard.subjects.map(async (subject) => {
          if (subject.subject) {
            const subjectDoc = await db.collection('subjects').findOne({ _id: subject.subject });
            subject.subject = subjectDoc;
          }
          if (subject.teacher) {
            const teacher = await db.collection('teachers').findOne({ _id: subject.teacher });
            subject.teacher = teacher;
          }
          return subject;
        }));
      }
      
      return reportCard;
    }));
    
    res.json(populatedReportCards);
  } catch (error) {
    console.error('Error fetching report cards:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student timetable - Updated for original schema
app.get('/api/timetable/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const timetableCollection = db.collection('timetables');
    
    const studentId = req.params.studentId;
    
    // First get the student to find their class
    const student = await db.collection('students').findOne({ schoolId: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const timetable = await timetableCollection.find({ 
      sclass: student.sclassName 
    })
    .populate('subject', 'subName subCode')
    .populate('teacher', 'name')
    .sort({ day: 1, time: 1 })
    .toArray();
    
    res.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student attendance statistics - Updated for original schema
app.get('/api/attendance-stats/:studentId', authenticateToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const studentCollection = db.collection('students');
    
    const studentId = req.params.studentId;
    const student = await studentCollection.findOne({ schoolId: studentId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const attendance = student.attendance || [];
    const totalDays = attendance.length;
    const presentDays = attendance.filter(record => record.status === 'Present').length;
    const absentDays = totalDays - presentDays;
    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    
    res.json({
      present: presentDays,
      absent: absentDays,
      total: totalDays,
      percentage: Math.round(percentage)
    });
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Accessible from any network interface`);
  console.log(`📱 React Native app can connect from any device on the network`);
  console.log('✅ Server updated for original school management schema');
});