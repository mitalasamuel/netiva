import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
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

const ClassScreen = ({ navigation }) => {
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchClassDetails = async (isRefresh = false) => {
    if (!user?.schoolId) {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
      Alert.alert('Error', 'No student ID available');
      return;
    }

    try {
      console.log('Fetching class details for student:', user.schoolId);
      const data = await studentAPI.getStudentClassDetails(user.schoolId);
      console.log('Class details received:', data);
      
      setClassDetails(data);
      
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
      Alert.alert('Error', 'Failed to load class information');
      
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClassDetails(true);
  };

  useEffect(() => {
    fetchClassDetails();
  }, [user?.schoolId]);

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentAvatar}>
        <IconSymbol name="user" size={20} color="#FF6B6B" />
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name || 'Unknown Student'}</Text>
        <Text style={styles.studentId}>ID: {item.schoolId || 'N/A'}</Text>
        {item.rollNumber && (
          <Text style={styles.studentRoll}>Roll: {item.rollNumber}</Text>
        )}
      </View>
      <View style={styles.studentStatus}>
        <Text style={styles.statusText}>Active</Text>
      </View>
    </View>
  );

  const renderTeacher = ({ item }) => (
    <View style={styles.teacherCard}>
      <View style={styles.teacherAvatar}>
        <IconSymbol name="user-check" size={20} color="#4CAF50" />
      </View>
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{item.name || 'Unknown Teacher'}</Text>
        <Text style={styles.teacherId}>ID: {item.teacherId || 'N/A'}</Text>
        {item.subject && (
          <Text style={styles.teacherSubject}>Subject: {item.subject}</Text>
        )}
      </View>
      <View style={styles.teacherStatus}>
        <Text style={styles.statusText}>Teaching</Text>
      </View>
    </View>
  );

  const renderSubject = ({ item }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectIconContainer}>
        <IconSymbol name="book" size={20} color="#FF6B6B" />
      </View>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{item.subName || 'Unknown Subject'}</Text>
        <Text style={styles.subjectCode}>Code: {item.subCode || 'N/A'}</Text>
        {item.teacher && (
          <Text style={styles.subjectTeacher}>Teacher: {item.teacher}</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading class information...</Text>
      </View>
    );
  }

  if (!classDetails) {
    return (
      <View style={styles.container}>
        <HeaderWithBack 
          title="My Class" 
          onBack={() => navigation.goBack()}
        />
        <View style={styles.noDataContainer}>
          <IconSymbol name="school" size={64} color="#8E8E93" />
          <Text style={styles.noDataText}>No class information available</Text>
          <Text style={styles.noDataSubtext}>
            You are not assigned to any class yet
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchClassDetails()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBack 
        title="My Class" 
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B6B']}
            tintColor="#FF6B6B"
          />
        }
      >
        {/* Class Information Header */}
        <View style={styles.classHeader}>
          <View style={styles.classIconContainer}>
            <IconSymbol name="school" size={32} color="#FF6B6B" />
          </View>
          <View style={styles.classInfo}>
            <Text style={styles.className}>{classDetails.sclassName || 'Unknown Class'}</Text>
            <Text style={styles.classCode}>Class Code: {classDetails.classCode || 'N/A'}</Text>
            {classDetails.section && (
              <Text style={styles.classSection}>Section: {classDetails.section}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => fetchClassDetails(true)}
            disabled={refreshing}
          >
            <IconSymbol 
              name="refresh" 
              size={16} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>

        {/* Class Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="users" size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>{classDetails.studentsCount || 0}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="user-check" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{classDetails.teachersCount || 0}</Text>
            <Text style={styles.statLabel}>Teachers</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="book" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{classDetails.subjectsCount || 0}</Text>
            <Text style={styles.statLabel}>Subjects</Text>
          </View>
        </View>

        {/* Subjects Section */}
        {classDetails.subjects && classDetails.subjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Class Subjects</Text>
            <FlatList
              data={classDetails.subjects}
              renderItem={renderSubject}
              keyExtractor={(item, index) => item._id?.toString() || index.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Teachers Section */}
        {classDetails.teachers && classDetails.teachers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Class Teachers</Text>
            <FlatList
              data={classDetails.teachers}
              renderItem={renderTeacher}
              keyExtractor={(item, index) => item._id?.toString() || index.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Students Section */}
        {classDetails.students && classDetails.students.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Class Students</Text>
            <FlatList
              data={classDetails.students}
              renderItem={renderStudent}
              keyExtractor={(item, index) => item._id?.toString() || index.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Subjects')}
            >
              <IconSymbol name="book" size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>My Subjects</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Timetable')}
            >
              <IconSymbol name="calendar" size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Timetable</Text>
            </TouchableOpacity>
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
    paddingBottom: 100, // Account for TikTok-style tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  classHeader: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  classIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  classCode: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  classSection: {
    fontSize: 14,
    color: '#8E8E93',
  },
  refreshButton: {
    backgroundColor: '#FF6B6B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subjectCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  subjectIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  subjectCode: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  subjectTeacher: {
    fontSize: 12,
    color: '#8E8E93',
  },
  teacherCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  teacherId: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  teacherSubject: {
    fontSize: 12,
    color: '#8E8E93',
  },
  teacherStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  studentCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: 12,
    color: '#8E8E93',
  },
  studentStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default ClassScreen;
