import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';

const AcademicRecordsScreen = () => {
  const [academicRecords, setAcademicRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('12345'); // Placeholder studentId

  useEffect(() => {
    const fetchAcademicRecords = async () => {
      try {
        const response = await api.get(`/api/academic/${studentId}`);
        setAcademicRecords(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load academic records'
        );
      }
    };

    fetchAcademicRecords();
  }, [studentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Academic Records</Text>
      
      {academicRecords?.map((record, index) => (
        <View key={index} style={styles.subjectContainer}>
          <View style={styles.subjectHeader}>
            <Text style={styles.subjectName}>{record.subject}</Text>
            <Text style={styles.subjectGrade}>{record.grade}</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Class Work:</Text>
              <Text style={styles.detailValue}>{record.classWork || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Home Work:</Text>
              <Text style={styles.detailValue}>{record.homeWork || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Test Score:</Text>
              <Text style={styles.detailValue}>{record.testScore !== undefined ? record.testScore : 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Exam Score:</Text>
              <Text style={styles.detailValue}>{record.examScore !== undefined ? record.examScore : 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Score:</Text>
              <Text style={styles.detailValue}>{record.totalScore !== undefined ? record.totalScore : 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Remarks:</Text>
              <Text style={styles.detailValue}>{record.remarks || 'N/A'}</Text>
            </View>
          </View>
        </View>
      ))}
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
  subjectContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subjectGrade: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '40%',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    width: '60%',
    color: '#666',
  },
});

export default AcademicRecordsScreen;