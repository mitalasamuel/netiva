const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function checkDatabaseStructure() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db('school');
    
    // List all collections
    console.log('\n📚 Collections in database:');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check students collection structure
    console.log('\n👥 Students Collection Structure:');
    const studentsCollection = db.collection('students');
    const studentCount = await studentsCollection.countDocuments();
    console.log(`  Total students: ${studentCount}`);
    
    if (studentCount > 0) {
      // Get a sample student document
      const sampleStudent = await studentsCollection.findOne();
      console.log('\n📋 Sample Student Document:');
      console.log(JSON.stringify(sampleStudent, null, 2));
      
      // Check what fields exist
      console.log('\n🔍 Student Document Fields:');
      Object.keys(sampleStudent).forEach(key => {
        console.log(`  - ${key}: ${typeof sampleStudent[key]} (${sampleStudent[key]})`);
      });
    } else {
      console.log('  No students found in database');
    }
    
    // Check if there are other user collections
    console.log('\n🔐 Other User Collections:');
    const adminCount = await db.collection('admins').countDocuments();
    const teacherCount = await db.collection('teachers').countDocuments();
    const secretaryCount = await db.collection('secretaries').countDocuments();
    
    console.log(`  Admins: ${adminCount}`);
    console.log(`  Teachers: ${teacherCount}`);
    console.log(`  Secretaries: ${secretaryCount}`);
    
    // Check schools collection
    console.log('\n🏫 Schools Collection:');
    const schoolsCollection = db.collection('schools');
    const schoolCount = await schoolsCollection.countDocuments();
    console.log(`  Total schools: ${schoolCount}`);
    
    if (schoolCount > 0) {
      const sampleSchool = await schoolsCollection.findOne();
      console.log('\n📋 Sample School Document:');
      console.log(JSON.stringify(sampleSchool, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkDatabaseStructure();
