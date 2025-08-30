const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');

    // Test login endpoint first to get token
    console.log('1. Testing login endpoint...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      studentId: 'S001'
    });
    console.log('✅ Login endpoint working');
    console.log(`   Token received: ${loginResponse.data.token ? 'Yes' : 'No'}\n`);

    const token = loginResponse.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Test announcements endpoint with token
    console.log('2. Testing announcements endpoint...');
    const announcementsResponse = await axios.get(`${BASE_URL}/announcements`, { headers });
    console.log('✅ Announcements endpoint working');
    console.log(`   Found ${announcementsResponse.data.length} announcements\n`);

    // Test student info endpoint
    console.log('3. Testing student info endpoint...');
    const studentResponse = await axios.get(`${BASE_URL}/student/S001`, { headers });
    console.log('✅ Student info endpoint working');
    console.log(`   Student name: ${studentResponse.data.name}\n`);

    // Test attendance endpoint
    console.log('4. Testing attendance endpoint...');
    const attendanceResponse = await axios.get(`${BASE_URL}/attendance/S001`, { headers });
    console.log('✅ Attendance endpoint working');
    console.log(`   Found ${attendanceResponse.data.length} attendance records\n`);

    // Test academic records endpoint
    console.log('5. Testing academic records endpoint...');
    const academicResponse = await axios.get(`${BASE_URL}/academic/S001`, { headers });
    console.log('✅ Academic records endpoint working');
    console.log(`   Found ${academicResponse.data.length} academic records\n`);

    // Test timetable endpoint
    console.log('6. Testing timetable endpoint...');
    const timetableResponse = await axios.get(`${BASE_URL}/timetable/S001`, { headers });
    console.log('✅ Timetable endpoint working');
    console.log(`   Found ${timetableResponse.data.length} timetable entries\n`);

    console.log('\n🎉 All API endpoints are working correctly!');
    console.log('\nYou can now test the React Native app with:');
    console.log('- Student ID: S001 (Emma Smith)');
    console.log('- Student ID: S002 (Michael Johnson)');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
