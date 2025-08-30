import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import HeaderWithBack from '../ui/HeaderWithBack';

const AttendanceScreen = ({ navigation }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!user?.schoolId) {
        setLoading(false);
        Alert.alert('Error', 'No student ID available');
        return;
      }

      try {
        const data = await studentAPI.getAttendance(user.schoolId);
        setAttendanceRecords(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load attendance records'
        );
      }
    };

    fetchAttendanceRecords();
  }, [user?.schoolId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Calculate attendance percentage
  const presentDays = attendanceRecords.filter(record => record.status === 'Present').length;
  const totalDays = attendanceRecords.length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <View style={styles.container}>
      <HeaderWithBack 
        title="Attendance Records" 
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Attendance Summary</Text>
            <Text style={styles.attendancePercentage}>{attendancePercentage}%</Text>
            <Text style={styles.attendanceLabel}>Present Days: {presentDays}/{totalDays}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Attendance Records</Text>
        {attendanceRecords.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No attendance records available</Text>
          </View>
        ) : (
          attendanceRecords.map((record, index) => (
            <View key={index} style={styles.recordContainer}>
              <View style={styles.recordHeader}>
                <Text style={styles.dateText}>{record.date}</Text>
                <Text style={[
                  styles.statusText,
                  record.status === 'Present' ? styles.present : styles.absent
                ]}>
                  {record.status}
                </Text>
              </View>
              {record.remarks ? (
                <Text style={styles.remarksText}>{record.remarks}</Text>
              ) : null}
            </View>
          ))
        )}
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
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  attendancePercentage: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4ECDC4',
  },
  attendanceLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  recordContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  present: {
    color: '#4CAF50',
  },
  absent: {
    color: '#FF6B6B',
  },
  remarksText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 5,
  },
  noDataContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  noDataText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default AttendanceScreen;