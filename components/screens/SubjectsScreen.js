import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { generalAPI, studentAPI } from '../services/api';
import HeaderWithBack from '../ui/HeaderWithBack';
import { IconSymbol } from '../ui/IconSymbol';

const SubjectsScreen = ({ navigation }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchSubjects = async (isRefresh = false) => {
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
      console.log('Fetching subjects for student:', user.schoolId);
      const data = await studentAPI.getStudentSubjects(user.schoolId);
      console.log('Subjects data received:', data);
      
      // If no subjects found for student, try to fetch all subjects as fallback
      if (!data || data.length === 0) {
        console.log('No student-specific subjects found, fetching all subjects as fallback');
        try {
          const allSubjects = await generalAPI.getSubjects();
          console.log('All subjects data received:', allSubjects);
          setSubjects(allSubjects || []);
        } catch (fallbackError) {
          console.error('Fallback subjects fetch failed:', fallbackError);
          setSubjects([]);
        }
      } else {
        setSubjects(data);
      }
      
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      
      // Try fallback to all subjects
      try {
        console.log('Trying fallback to fetch all subjects');
        const allSubjects = await generalAPI.getSubjects();
        console.log('Fallback subjects data received:', allSubjects);
        setSubjects(allSubjects || []);
      } catch (fallbackError) {
        console.error('Fallback subjects fetch failed:', fallbackError);
        setSubjects([]);
      }
      
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubjects(true);
  };

  useEffect(() => {
    fetchSubjects();
  }, [user?.schoolId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBack 
        title="My Subjects" 
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
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Academic Subjects</Text>
          <Text style={styles.headerSubtitle}>
            You are enrolled in {subjects.length} subjects this academic year
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => fetchSubjects(true)}
            disabled={refreshing}
          >
            <IconSymbol 
              name="refresh" 
              size={16} 
              color="#FFFFFF" 
            />
            <Text style={styles.refreshButtonText}>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </View>

        {subjects.length === 0 ? (
          <View style={styles.noDataContainer}>
            <IconSymbol name="book" size={64} color="#8E8E93" />
            <Text style={styles.noDataText}>No subjects available</Text>
            <Text style={styles.noDataSubtext}>
              Your subjects will appear here once they are assigned by your school
            </Text>
          </View>
        ) : (
          <View style={styles.subjectsContainer}>
            {subjects.map((subject, index) => (
              <View key={subject._id || index} style={styles.subjectCard}>
                <View style={styles.subjectHeader}>
                  <View style={styles.subjectIconContainer}>
                    <IconSymbol 
                      name="school" 
                      size={24} 
                      color="#FF6B6B" 
                    />
                  </View>
                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>{subject.subName || 'Subject Name'}</Text>
                    <Text style={styles.subjectCode}>{subject.subCode || 'Subject Code'}</Text>
                  </View>
                  <View style={styles.subjectStatus}>
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
                
                <View style={styles.subjectDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Subject Code:</Text>
                    <Text style={styles.detailValue}>{subject.subCode || 'N/A'}</Text>
                  </View>
                  
                  {subject.sessions && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Sessions:</Text>
                      <Text style={styles.detailValue}>{subject.sessions}</Text>
                    </View>
                  )}
                  
                  {subject.teacher && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Teacher:</Text>
                      <Text style={styles.detailValue}>{subject.teacher}</Text>
                    </View>
                  )}
                  
                  {subject.description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.descriptionLabel}>Description:</Text>
                      <Text style={styles.descriptionText}>{subject.description}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Results')}
            >
              <IconSymbol name="school" size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>View Results</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Attendance')}
            >
              <IconSymbol name="calendar-check" size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Check Attendance</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
  },
  subjectsContainer: {
    marginBottom: 30,
  },
  subjectCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  subjectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 14,
    color: '#8E8E93',
  },
  subjectStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },
  subjectDetails: {
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: 10,
  },
  descriptionLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
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
  debugSection: {
    marginBottom: 30,
  },
  debugCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  debugText: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});

export default SubjectsScreen;
