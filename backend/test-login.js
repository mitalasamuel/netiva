const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing login with student ID: STU580001');
    
    const response = await axios.post('http://localhost:3000/api/login', {
      userId: 'STU580001',
      role: 'Student'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    
    // Test getting student info with the token
    console.log('\n🧪 Testing student info retrieval...');
    
    const studentResponse = await axios.get('http://localhost:3000/api/student/STU580001', {
      headers: {
        'Authorization': `Bearer ${response.data.token}`
      }
    });
    
    console.log('✅ Student info retrieved successfully!');
    console.log('Student data:', JSON.stringify(studentResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testLogin();
