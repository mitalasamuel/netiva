const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function restoreOriginalSchema() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('school');
    
    console.log('⚠️  WARNING: This will clear all existing data and restore the original schema structure');
    console.log('This is necessary to restore your original comprehensive school management system');
    
    // Clear all existing collections to restore original structure
    console.log('\nClearing existing collections...');
    const collections = ['students', 'parents', 'attendance', 'academic_records', 'announcements', 'timetable'];
    
    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop();
        console.log(`✅ Dropped collection: ${collectionName}`);
      } catch (error) {
        console.log(`ℹ️  Collection ${collectionName} did not exist`);
      }
    }
    
    // Create the proper collections with original schema structure
    console.log('\nCreating collections with original schema...');
    
    // Create indexes for the original schema
    await db.createCollection('students');
    await db.collection('students').createIndex({ schoolId: 1 }, { unique: true });
    await db.collection('students').createIndex({ school: 1 });
    await db.collection('students').createIndex({ sclassName: 1 });
    console.log('✅ Created students collection with proper indexes');
    
    await db.createCollection('admins');
    await db.collection('admins').createIndex({ schoolName: 1 }, { unique: true });
    await db.collection('admins').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created admins collection with proper indexes');
    
    await db.createCollection('teachers');
    await db.collection('teachers').createIndex({ teacherId: 1 }, { unique: true });
    await db.collection('teachers').createIndex({ school: 1 });
    console.log('✅ Created teachers collection with proper indexes');
    
    await db.createCollection('secretaries');
    await db.collection('secretaries').createIndex({ secretaryId: 1 }, { unique: true });
    await db.collection('secretaries').createIndex({ school: 1 });
    console.log('✅ Created secretaries collection with proper indexes');
    
    await db.createCollection('sclasses');
    await db.collection('sclasses').createIndex({ school: 1 });
    console.log('✅ Created sclasses collection with proper indexes');
    
    await db.createCollection('subjects');
    await db.collection('subjects').createIndex({ school: 1 });
    await db.collection('subjects').createIndex({ subCode: 1 });
    console.log('✅ Created subjects collection with proper indexes');
    
    await db.createCollection('feestructures');
    await db.collection('feestructures').createIndex({ school: 1 });
    console.log('✅ Created feestructures collection with proper indexes');
    
    await db.createCollection('invoices');
    await db.collection('invoices').createIndex({ school: 1 });
    await db.collection('invoices').createIndex({ student: 1 });
    console.log('✅ Created invoices collection with proper indexes');
    
    await db.createCollection('payments');
    await db.collection('payments').createIndex({ school: 1 });
    await db.collection('payments').createIndex({ invoice: 1 });
    console.log('✅ Created payments collection with proper indexes');
    
    await db.createCollection('notices');
    await db.collection('notices').createIndex({ school: 1 });
    console.log('✅ Created notices collection with proper indexes');
    
    await db.createCollection('comments');
    await db.collection('comments').createIndex({ school: 1 });
    console.log('✅ Created comments collection with proper indexes');
    
    await db.createCollection('media');
    await db.collection('media').createIndex({ adminId: 1 });
    console.log('✅ Created media collection with proper indexes');
    
    await db.createCollection('galleries');
    await db.collection('galleries').createIndex({ adminId: 1 });
    console.log('✅ Created galleries collection with proper indexes');
    
    console.log('\n🎉 Original schema structure restored successfully!');
    console.log('\n📋 Collections created:');
    console.log('- students (with exam results, attendance, guardian info)');
    console.log('- admins (school administrators)');
    console.log('- teachers (with class assignments)');
    console.log('- secretaries (school secretaries)');
    console.log('- sclasses (school classes)');
    console.log('- subjects (with teacher assignments)');
    console.log('- feestructures (fee structures)');
    console.log('- invoices (student invoices)');
    console.log('- payments (payment records)');
    console.log('- notices (school notices)');
    console.log('- comments (student comments)');
    console.log('- media (school media)');
    console.log('- galleries (photo galleries)');
    
    console.log('\n⚠️  IMPORTANT: Your original data has been cleared.');
    console.log('You will need to restore your actual student data from your backup.');
    console.log('The schema structure is now ready for your original data.');
    
    console.log('\n📝 Next steps:');
    console.log('1. Restore your original student data from backup');
    console.log('2. Update your React Native app to use the original schema');
    console.log('3. Test the authentication with your original student IDs');
    
  } catch (error) {
    console.error('Error restoring original schema:', error);
  } finally {
    await client.close();
  }
}

restoreOriginalSchema();
