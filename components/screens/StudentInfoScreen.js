import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import HeaderWithBack from '../ui/HeaderWithBack';

const StudentInfoScreen = ({ navigation }) => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!studentInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No student information available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBack 
        title="Student Information" 
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: studentInfo?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.studentName}>{studentInfo?.name || 'Student Name'}</Text>
            <Text style={styles.studentId}>ID: {studentInfo?.schoolId || 'N/A'}</Text>
            <Text style={styles.studentClass}>Roll Number: {studentInfo?.rollNum || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>
              {studentInfo?.dateOfBirth ? new Date(studentInfo.dateOfBirth).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{studentInfo?.gender || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{studentInfo?.email || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{studentInfo?.address || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{studentInfo?.phone || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emergency Contact:</Text>
            <Text style={styles.infoValue}>{studentInfo?.emergencyContact || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Guardian Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Guardian Name:</Text>
            <Text style={styles.infoValue}>{studentInfo?.guardianName || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Guardian Phone:</Text>
            <Text style={styles.infoValue}>{studentInfo?.guardianPhone || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Guardian Email:</Text>
            <Text style={styles.infoValue}>{studentInfo?.guardianEmail || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Guardian NIN:</Text>
            <Text style={styles.infoValue}>{studentInfo?.guardianNIN || 'N/A'}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
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
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  studentId: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  studentClass: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '700',
    width: '40%',
    color: '#FFFFFF',
  },
  infoValue: {
    fontSize: 16,
    width: '60%',
    color: '#8E8E93',
  },
});

export default StudentInfoScreen;