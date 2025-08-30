import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import HeaderWithBack from '../ui/HeaderWithBack';
import { IconSymbol } from '../ui/IconSymbol';

const ProfileScreen = ({ navigation }) => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (!user?.schoolId) {
        setLoading(false);
        Alert.alert('Error', 'No student ID available');
        return;
      }

      try {
        const data = await studentAPI.getStudentInfo(user.schoolId);
        setStudentInfo(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load student information'
        );
      }
    };

    fetchStudentInfo();
  }, [user?.schoolId]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBack 
        title="Student Profile" 
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: studentInfo?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.studentName}>{studentInfo?.name || user?.name || 'Student Name'}</Text>
            <Text style={styles.studentId}>ID: {studentInfo?.schoolId || user?.schoolId || 'N/A'}</Text>
            <Text style={styles.studentClass}>{studentInfo?.sclass?.sclassName || 'N/A'}</Text>
          </View>
        </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <IconSymbol name="school" size={24} color="#007bff" />
          <Text style={styles.statNumber}>{studentInfo?.rollNum || 'N/A'}</Text>
          <Text style={styles.statLabel}>Roll Number</Text>
        </View>
        <View style={styles.statCard}>
          <IconSymbol name="book" size={24} color="#28a745" />
          <Text style={styles.statNumber}>{studentInfo?.subjectsCount || 0}</Text>
          <Text style={styles.statLabel}>Subjects</Text>
        </View>
        <View style={styles.statCard}>
          <IconSymbol name="event-available" size={24} color="#ffc107" />
          <Text style={styles.statNumber}>{studentInfo?.attendance?.length || 0}</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Payments')}
          >
            <IconSymbol name="payment" size={24} color="#4CAF50" />
            <Text style={styles.quickActionText}>Payments</Text>
            <Text style={styles.quickActionSubtext}>View & Manage</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Results')}
          >
            <IconSymbol name="book" size={24} color="#FF6B6B" />
            <Text style={styles.quickActionText}>Results</Text>
            <Text style={styles.quickActionSubtext}>Exam Scores</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <IconSymbol name="person" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{studentInfo?.name || 'N/A'}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <IconSymbol name="event" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>
                {studentInfo?.dateOfBirth ? new Date(studentInfo.dateOfBirth).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <IconSymbol name="wc" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{studentInfo?.gender || 'N/A'}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <IconSymbol name="email" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{studentInfo?.email || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Guardian Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guardian Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <IconSymbol name="person" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Guardian Name</Text>
              <Text style={styles.infoValue}>{studentInfo?.guardianName || 'N/A'}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <IconSymbol name="phone" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Guardian Phone</Text>
              <Text style={styles.infoValue}>{studentInfo?.guardianPhone || 'N/A'}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <IconSymbol name="email" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Guardian Email</Text>
              <Text style={styles.infoValue}>{studentInfo?.guardianEmail || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <IconSymbol name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingBottom: 100, // Account for TikTok-style tab bar
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  profileHeader: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  studentId: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 3,
  },
  studentClass: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#1C1C1E',
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  infoCard: {
    backgroundColor: '#1C1C1E',
    marginHorizontal: 15,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  quickActionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '45%', // Adjusted for two cards
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  quickActionSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 15,
    borderRadius: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});

export default ProfileScreen;
