const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function populateSampleData() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('school');
    
    // Sample parents data
    const parentsData = [
      {
        parentId: 'P001',
        studentId: 'S001',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1234567890'
      },
      {
        parentId: 'P002',
        studentId: 'S002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1234567891'
      },
      {
        parentId: 'P003',
        studentId: 'STU580001',
        name: 'Robert Thompson',
        email: 'robert.thompson@email.com',
        phone: '+1234567892'
      }
    ];
    
    // Sample students data
    const studentsData = [
      {
        studentId: 'S001',
        name: 'Emma Smith',
        class: 'Grade 10A',
        dob: '2008-05-15',
        gender: 'Female',
        bloodGroup: 'O+',
        address: '123 Main St, City, State',
        phone: '+1234567890',
        email: 'emma.smith@school.com',
        fatherName: 'John Smith',
        motherName: 'Mary Smith',
        parentPhone: '+1234567890',
        photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      },
      {
        studentId: 'S002',
        name: 'Michael Johnson',
        class: 'Grade 9B',
        dob: '2009-03-22',
        gender: 'Male',
        bloodGroup: 'A+',
        address: '456 Oak Ave, City, State',
        phone: '+1234567891',
        email: 'michael.johnson@school.com',
        fatherName: 'David Johnson',
        motherName: 'Sarah Johnson',
        parentPhone: '+1234567891',
        photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      },
      {
        studentId: 'STU580001',
        name: 'Alex Thompson',
        class: 'Grade 11A',
        dob: '2007-08-10',
        gender: 'Male',
        bloodGroup: 'B+',
        address: '789 Pine St, City, State',
        phone: '+1234567892',
        email: 'alex.thompson@school.com',
        fatherName: 'Robert Thompson',
        motherName: 'Lisa Thompson',
        parentPhone: '+1234567892',
        photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      }
    ];
    
    // Sample attendance data
    const attendanceData = [
      {
        studentId: 'S001',
        date: '2024-01-15',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'S001',
        date: '2024-01-16',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'S001',
        date: '2024-01-17',
        status: 'Absent',
        remarks: 'Sick leave'
      },
      {
        studentId: 'S001',
        date: '2024-01-18',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'S001',
        date: '2024-01-19',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU580001',
        date: '2024-01-15',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU580001',
        date: '2024-01-16',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU580001',
        date: '2024-01-17',
        status: 'Present',
        remarks: ''
      },
      {
        studentId: 'STU580001',
        date: '2024-01-18',
        status: 'Absent',
        remarks: 'Family event'
      },
      {
        studentId: 'STU580001',
        date: '2024-01-19',
        status: 'Present',
        remarks: ''
      }
    ];
    
    // Sample academic records data
    const academicRecordsData = [
      {
        studentId: 'S001',
        subject: 'Mathematics',
        grade: 'A',
        classWork: '85%',
        homeWork: '90%',
        testScore: 88,
        examScore: 92,
        totalScore: 90,
        remarks: 'Excellent performance'
      },
      {
        studentId: 'S001',
        subject: 'English',
        grade: 'B+',
        classWork: '80%',
        homeWork: '85%',
        testScore: 82,
        examScore: 85,
        totalScore: 84,
        remarks: 'Good work, needs improvement in writing'
      },
      {
        studentId: 'S001',
        subject: 'Science',
        grade: 'A-',
        classWork: '88%',
        homeWork: '92%',
        testScore: 90,
        examScore: 88,
        totalScore: 89,
        remarks: 'Very good understanding of concepts'
      },
      {
        studentId: 'STU580001',
        subject: 'Mathematics',
        grade: 'A+',
        classWork: '92%',
        homeWork: '95%',
        testScore: 94,
        examScore: 96,
        totalScore: 95,
        remarks: 'Outstanding performance in advanced mathematics'
      },
      {
        studentId: 'STU580001',
        subject: 'Physics',
        grade: 'A',
        classWork: '88%',
        homeWork: '90%',
        testScore: 89,
        examScore: 91,
        totalScore: 90,
        remarks: 'Excellent understanding of physics concepts'
      },
      {
        studentId: 'STU580001',
        subject: 'Chemistry',
        grade: 'A-',
        classWork: '85%',
        homeWork: '88%',
        testScore: 86,
        examScore: 89,
        totalScore: 87,
        remarks: 'Very good lab work and theoretical knowledge'
      }
    ];
    
    // Sample announcements data
    const announcementsData = [
      {
        title: 'Parent-Teacher Meeting',
        content: 'Parent-teacher meeting will be held on Friday, January 25th, 2024 from 2:00 PM to 4:00 PM. All parents are requested to attend.',
        date: '2024-01-20',
        author: 'School Administration'
      },
      {
        title: 'Sports Day Announcement',
        content: 'Annual Sports Day will be celebrated on February 15th, 2024. Students are encouraged to participate in various sports events.',
        date: '2024-01-18',
        author: 'Physical Education Department'
      },
      {
        title: 'Exam Schedule',
        content: 'Mid-term examinations will begin from January 30th, 2024. Detailed schedule will be shared with students.',
        date: '2024-01-15',
        author: 'Academic Department'
      }
    ];
    
    // Sample timetable data
    const timetableData = [
      {
        studentId: 'S001',
        day: 'Monday',
        subject: 'Mathematics',
        time: '8:00 AM - 9:00 AM',
        teacher: 'Mr. Brown',
        room: 'Room 101'
      },
      {
        studentId: 'S001',
        day: 'Monday',
        subject: 'English',
        time: '9:15 AM - 10:15 AM',
        teacher: 'Ms. Davis',
        room: 'Room 102'
      },
      {
        studentId: 'S001',
        day: 'Monday',
        subject: 'Science',
        time: '10:30 AM - 11:30 AM',
        teacher: 'Dr. Wilson',
        room: 'Lab 1'
      },
      {
        studentId: 'S001',
        day: 'Tuesday',
        subject: 'History',
        time: '8:00 AM - 9:00 AM',
        teacher: 'Mrs. Anderson',
        room: 'Room 103'
      },
      {
        studentId: 'S001',
        day: 'Tuesday',
        subject: 'Mathematics',
        time: '9:15 AM - 10:15 AM',
        teacher: 'Mr. Brown',
        room: 'Room 101'
      },
      {
        studentId: 'STU580001',
        day: 'Monday',
        subject: 'Advanced Mathematics',
        time: '8:00 AM - 9:30 AM',
        teacher: 'Dr. Rodriguez',
        room: 'Room 201'
      },
      {
        studentId: 'STU580001',
        day: 'Monday',
        subject: 'Physics',
        time: '9:45 AM - 11:15 AM',
        teacher: 'Prof. Chen',
        room: 'Lab 2'
      },
      {
        studentId: 'STU580001',
        day: 'Monday',
        subject: 'Chemistry',
        time: '11:30 AM - 1:00 PM',
        teacher: 'Dr. Williams',
        room: 'Lab 3'
      },
      {
        studentId: 'STU580001',
        day: 'Tuesday',
        subject: 'English Literature',
        time: '8:00 AM - 9:30 AM',
        teacher: 'Ms. Johnson',
        room: 'Room 205'
      },
      {
        studentId: 'STU580001',
        day: 'Tuesday',
        subject: 'Advanced Mathematics',
        time: '9:45 AM - 11:15 AM',
        teacher: 'Dr. Rodriguez',
        room: 'Room 201'
      }
    ];
    
    console.log('Updating database with sample data...');
    
    // Update parents data (upsert - insert if not exists, update if exists)
    for (const parent of parentsData) {
      await db.collection('parents').updateOne(
        { parentId: parent.parentId },
        { $set: parent },
        { upsert: true }
      );
    }
    console.log('Parents data updated');
    
    // Update schools data (upsert - insert if not exists, update if exists)
    for (const school of schoolsData) {
      await db.collection('schools').updateOne(
        { _id: school._id },
        { $set: school },
        { upsert: true }
      );
    }
    console.log('Schools data updated');
    
    // Update students data (upsert - insert if not exists, update if exists)
    for (const student of studentsData) {
      await db.collection('students').updateOne(
        { studentId: student.studentId },
        { $set: student },
        { upsert: true }
      );
    }
    console.log('Students data updated');
    
    // Clear and insert attendance data (replace for this collection)
    await db.collection('attendance').deleteMany({});
    await db.collection('attendance').insertMany(attendanceData);
    console.log('Attendance data updated');
    
    // Clear and insert academic records data (replace for this collection)
    await db.collection('academic_records').deleteMany({});
    await db.collection('academic_records').insertMany(academicRecordsData);
    console.log('Academic records data updated');
    
    // Clear and insert announcements data (replace for this collection)
    await db.collection('announcements').deleteMany({});
    await db.collection('announcements').insertMany(announcementsData);
    console.log('Announcements data updated');
    
    // Clear and insert timetable data (replace for this collection)
    await db.collection('timetable').deleteMany({});
    await db.collection('timetable').insertMany(timetableData);
    console.log('Timetable data updated');
    
    console.log('Sample data updated successfully!');
    console.log('\nNote: Existing students were preserved and updated, not replaced.');
    
  } catch (error) {
    console.error('Error updating sample data:', error);
  } finally {
    await client.close();
  }
}

populateSampleData();
