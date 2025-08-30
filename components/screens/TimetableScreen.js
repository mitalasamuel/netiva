import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';

const TimetableScreen = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!user?.schoolId) {
        setLoading(false);
        Alert.alert('Error', 'No student ID available');
        return;
      }

      try {
        const data = await studentAPI.getTimetable(user.schoolId);
        setTimetable(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load timetable'
        );
      }
    };

    fetchTimetable();
  }, [user?.schoolId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Group timetable by day
  const timetableByDay = timetable.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {});

  // Days of the week in order
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Timetable</Text>
      
      {timetable.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No timetable available</Text>
        </View>
      ) : (
        daysOfWeek.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayHeader}>{day}</Text>
            {timetableByDay[day] && timetableByDay[day].length > 0 ? (
              timetableByDay[day].map((item, itemIndex) => (
                <View key={itemIndex} style={styles.classContainer}>
                  <View style={styles.classHeader}>
                    <Text style={styles.subjectName}>{item.subject}</Text>
                    <Text style={styles.timeSlot}>{item.time}</Text>
                  </View>
                  <View style={styles.classDetails}>
                    <Text style={styles.detailText}>Teacher: {item.teacher}</Text>
                    <Text style={styles.detailText}>Room: {item.room}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noClassContainer}>
                <Text style={styles.noClassText}>No classes scheduled</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 8,
  },
  classContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timeSlot: {
    fontSize: 16,
    color: '#007bff',
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  noClassContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noClassText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  noDataContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default TimetableScreen;