const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function checkExistingStudents() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('school');
    
    // Check existing students
    const students = await db.collection('students').find({}).toArray();
    console.log('\n=== EXISTING STUDENTS IN DATABASE ===');
    console.log(`Total students found: ${students.length}`);
    
    students.forEach((student, index) => {
      console.log(`\n${index + 1}. Student ID: ${student.studentId}`);
      console.log(`   Name: ${student.name}`);
      console.log(`   Class: ${student.class}`);
      console.log(`   Email: ${student.email}`);
    });
    
    // Check existing parents
    const parents = await db.collection('parents').find({}).toArray();
    console.log('\n=== EXISTING PARENTS IN DATABASE ===');
    console.log(`Total parents found: ${parents.length}`);
    
    parents.forEach((parent, index) => {
      console.log(`\n${index + 1}. Parent ID: ${parent.parentId}`);
      console.log(`   Student ID: ${parent.studentId}`);
      console.log(`   Name: ${parent.name}`);
      console.log(`   Email: ${parent.email}`);
    });
    
    // Check other collections
    const attendance = await db.collection('attendance').find({}).toArray();
    const academic = await db.collection('academic_records').find({}).toArray();
    const announcements = await db.collection('announcements').find({}).toArray();
    const timetable = await db.collection('timetable').find({}).toArray();
    
    console.log('\n=== COLLECTION SUMMARY ===');
    console.log(`Students: ${students.length}`);
    console.log(`Parents: ${parents.length}`);
    console.log(`Attendance records: ${attendance.length}`);
    console.log(`Academic records: ${academic.length}`);
    console.log(`Announcements: ${announcements.length}`);
    console.log(`Timetable entries: ${timetable.length}`);
    
  } catch (error) {
    console.error('Error checking existing students:', error);
  } finally {
    await client.close();
  }
}

checkExistingStudents();
