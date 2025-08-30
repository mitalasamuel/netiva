import api from './api';
import { mockUserProfile } from './mockData';

// Login function - authenticates parent/student using ID
export const login = async (parentId) => {
  try {
    // For testing purposes, we're using mock data
    // In a real implementation, this would call the actual API
    // const response = await api.post('/auth/login', { parentId });
    
    // Mock implementation
    if (parentId) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { token: 'mock-jwt-token', user: mockUserProfile };
    } else {
      throw new Error('Invalid Parent ID');
    }
  } catch (error) {
    throw error;
  }
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    // For testing purposes, we're using mock data
    // In a real implementation, this would call the actual API
    // const response = await api.get('/auth/profile');
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUserProfile;
  } catch (error) {
    throw error;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
};