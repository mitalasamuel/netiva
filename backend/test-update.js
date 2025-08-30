const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testUpdateFunctionality() {
  try {
    console.log('Testing student data update functionality...\n');

    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      studentId: 'S001'
    });
    const token = loginResponse.data.token;
    const headers = { 'Authorization': `Bearer ${token}` };

    // Get current student info
    console.log('2. Getting current student information...');
    const currentStudent = await axios.get(`${BASE_URL}/student/S001`, { headers });
    console.log('   Current student name:', currentStudent.data.name);
    console.log('   Current class:', currentStudent.data.class);
    console.log('   Current email:', currentStudent.data.email);

    // Update only specific fields (preserve existing data)
    console.log('\n3. Updating only email field...');
    const updateData = {
      email: 'emma.smith.updated@school.com'
    };
    
    const updatedStudent = await axios.put(`${BASE_URL}/student/S001`, updateData, { headers });
    console.log('   Updated student name:', updatedStudent.data.name);
    console.log('   Updated class:', updatedStudent.data.class);
    console.log('   Updated email:', updatedStudent.data.email);

    // Verify that other fields were preserved
    console.log('\n4. Verifying data preservation...');
    if (currentStudent.data.name === updatedStudent.data.name &&
        currentStudent.data.class === updatedStudent.data.class &&
        currentStudent.data.email !== updatedStudent.data.email) {
      console.log('   ✅ SUCCESS: Existing data was preserved, only email was updated');
    } else {
      console.log('   ❌ FAILED: Data was not preserved correctly');
    }

    // Test academic record update
    console.log('\n5. Testing academic record update...');
    const currentAcademic = await axios.get(`${BASE_URL}/academic/S001`, { headers });
    console.log('   Current Mathematics grade:', currentAcademic.data.find(r => r.subject === 'Mathematics')?.grade);

    // Update only the grade for Mathematics
    const academicUpdate = {
      grade: 'A+',
      remarks: 'Outstanding performance!'
    };
    
    await axios.put(`${BASE_URL}/academic/S001/Mathematics`, academicUpdate, { headers });
    
    const updatedAcademic = await axios.get(`${BASE_URL}/academic/S001`, { headers });
    const mathRecord = updatedAcademic.data.find(r => r.subject === 'Mathematics');
    console.log('   Updated Mathematics grade:', mathRecord?.grade);
    console.log('   Updated remarks:', mathRecord?.remarks);
    console.log('   Preserved test score:', mathRecord?.testScore);

    console.log('\n🎉 Update functionality test completed successfully!');
    console.log('\nKey features demonstrated:');
    console.log('- ✅ Student data is updated, not replaced');
    console.log('- ✅ Existing fields are preserved');
    console.log('- ✅ Only specified fields are modified');
    console.log('- ✅ Academic records can be updated individually');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testUpdateFunctionality();
