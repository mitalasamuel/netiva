import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

// Resolve API base URL per platform
const API_PORT = 3000;
const BASE_URL = Platform.OS === 'android'
  ? `http://10.0.2.2:${API_PORT}/api` // Android emulator loopback to host
  : `http://localhost:${API_PORT}/api`;

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// READ-ONLY API calls - No creation, updating, or deletion
export const authAPI = {
  // Login with existing student ID
  login: async (studentId) => {
    console.log('🌐 API: Making login request for student ID:', studentId);
    console.log('🌐 API: Request URL:', `${BASE_URL}/login`);
    console.log('🌐 API: Request payload:', { userId: studentId, role: 'Student' });
    
    try {
      const response = await api.post('/login', { 
        userId: studentId, 
        role: 'Student' 
      });
      console.log('🌐 API: Login response received:', response.data);
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('🌐 API: Token and user data stored in AsyncStorage');
      }
      return response.data;
    } catch (error) {
      console.error('🌐 API: Login request failed:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// READ-ONLY Student data API calls
export const studentAPI = {
  // Get student information (READ ONLY)
  getStudentInfo: async (studentId) => {
    const response = await api.get(`/student/${studentId}`);
    return response.data;
  },

  // Get attendance records (READ ONLY)
  getAttendance: async (studentId) => {
    const response = await api.get(`/attendance/${studentId}`);
    return response.data;
  },

  // Get attendance statistics (READ ONLY)
  getAttendanceStats: async (studentId) => {
    const response = await api.get(`/attendance-stats/${studentId}`);
    return response.data;
  },

  // Get exam results (READ ONLY)
  getExamResults: async (studentId) => {
    const response = await api.get(`/exam-results/${studentId}`);
    return response.data;
  },

  // Get student subjects (READ ONLY)
  getStudentSubjects: async (studentId) => {
    const response = await api.get(`/student-subjects/${studentId}`);
    return response.data;
  },

  // Get student's class details with all students and teachers (READ ONLY)
  getStudentClassDetails: async (studentId) => {
    const response = await api.get(`/student-class-details/${studentId}`);
    return response.data;
  },

  // Get report cards (READ ONLY)
  getReportCards: async (studentId) => {
    const response = await api.get(`/report-cards/${studentId}`);
    return response.data;
  },

  // Get timetable (READ ONLY)
  getTimetable: async (studentId) => {
    const response = await api.get(`/timetable/${studentId}`);
    return response.data;
  }
};

// READ-ONLY General API calls
export const generalAPI = {
  // Get notices (READ ONLY)
  getNotices: async () => {
    const response = await api.get('/notices');
    return response.data;
  },

  // Get classes (READ ONLY)
  getClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  // Get subjects (READ ONLY)
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  // Get media (READ ONLY)
  getMedia: async () => {
    const response = await api.get('/media');
    return response.data;
  },

  // Get student payments (READ ONLY)
  getStudentPayments: async (studentId) => {
    const response = await api.get(`/student-payments/${studentId}`);
    return response.data;
  }
};

export default api;