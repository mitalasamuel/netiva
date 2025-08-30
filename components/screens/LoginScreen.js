
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!studentId.trim()) {
      Alert.alert('Error', 'Please enter your Student ID');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Attempting login with student ID:', studentId);
      // READ ONLY - Just authenticate with existing student ID
      const response = await login(studentId);
      console.log('✅ Login successful:', response);
      setLoading(false);
      
      // Navigate to main app screen using the correct navigation method
      try {
        navigation.navigate('MainTabs');
        console.log('🚀 Navigation to MainTabs successful');
      } catch (navError) {
        console.error('❌ Navigation error:', navError);
        // Fallback: try to replace the current screen
        navigation.replace('MainTabs');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      setLoading(false);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage;
        console.error('❌ Server error response:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
        console.error('❌ Network error:', error.request);
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
        console.error('❌ Other error:', error.message);
      }
      
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>School Management Portal</Text>
        <Text style={styles.loginSubtitle}>Enter your Student ID to view your information</Text>
        
        <Text style={styles.inputLabel}>Student ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Student ID"
          placeholderTextColor="#666"
          value={studentId}
          onChangeText={setStudentId}
          autoCapitalize="none"
          keyboardType="default"
        />
        
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging in...' : 'View My Information'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.noAccountText}>
          This app only displays existing student information.
        </Text>
        
        <TouchableOpacity>
          <Text style={styles.backToHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 12,
    color: '#fff',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noAccountText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 10,
  },
  backToHomeText: {
    color: '#8A2BE2',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;
