const axios = require('axios');

const BASE_URL = 'http://172.20.10.6:3000/api';

async function testSubjectsAPI() {
  try {
    console.log('🧪 Testing Subjects API Endpoints...\n');

    // First, login to get a token
    console.log('🔐 Logging in to get access token...');
    let token;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/login`, {
        userId: 'STU580001',
        role: 'Student'
      });
      
      if (loginResponse.data.token) {
        token = loginResponse.data.token;
        console.log('✅ Login successful, token received');
      } else {
        console.log('❌ Login failed - no token in response');
        console.log('Response data:', loginResponse.data);
        return;
      }
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 1: Get student subjects
    console.log('1. Testing GET /student-subjects/:studentId');
    try {
      const response = await axios.get(`${BASE_URL}/student-subjects/STU580001`, { headers });
      console.log('✅ Student subjects endpoint working');
      console.log('📚 Subjects found:', response.data.length);
      if (response.data.length > 0) {
        console.log('📖 First subject:', response.data[0]);
      }
    } catch (error) {
      console.log('❌ Student subjects endpoint failed:', error.response?.data?.message || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Get student info (should include populated subjects)
    console.log('2. Testing GET /student/:studentId (with populated subjects)');
    try {
      const response = await axios.get(`${BASE_URL}/student/STU580001`, { headers });
      console.log('✅ Student info endpoint working');
      console.log('👤 Student name:', response.data.name);
      console.log('🏫 Class:', response.data.sclassName);
      console.log('📚 Exam results count:', response.data.examResult?.length || 0);
      
      if (response.data.examResult && response.data.examResult.length > 0) {
        console.log('📖 First exam result subject:', response.data.examResult[0].subject);
      }
    } catch (error) {
      console.log('❌ Student info endpoint failed:', error.response?.data?.message || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Get all subjects
    console.log('3. Testing GET /subjects');
    try {
      const response = await axios.get(`${BASE_URL}/subjects`, { headers });
      console.log('✅ All subjects endpoint working');
      console.log('📚 Total subjects in school:', response.data.length);
      if (response.data.length > 0) {
        console.log('📖 First subject:', response.data[0]);
      }
    } catch (error) {
      console.log('❌ All subjects endpoint failed:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSubjectsAPI();
