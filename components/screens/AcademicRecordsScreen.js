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

const AcademicRecordsScreen = () => {
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchExamResults = async () => {
      if (!user?.schoolId) {
        setLoading(false);
        Alert.alert('Error', 'No student ID available');
        return;
      }

      try {
        // READ ONLY - Just fetch existing exam results
        const data = await studentAPI.getExamResults(user.schoolId);
        setExamResults(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load exam results'
        );
      }
    };

    fetchExamResults();
  }, [user?.schoolId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Exam Results</Text>
        
        {examResults.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No exam results available</Text>
          </View>
        ) : (
          examResults.map((result, index) => (
            <View key={index} style={styles.subjectContainer}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>Subject ID: {result.subName}</Text>
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Beginning Term:</Text>
                  <Text style={styles.detailValue}>{result.marksObtained?.beginning || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mid Term:</Text>
                  <Text style={styles.detailValue}>{result.marksObtained?.midTerm || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>End Term:</Text>
                  <Text style={styles.detailValue}>{result.marksObtained?.endTerm || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weekend Work:</Text>
                  <Text style={styles.detailValue}>{result.marksObtained?.weekendWork || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Holiday Package:</Text>
                  <Text style={styles.detailValue}>{result.marksObtained?.holidayPackage || 'N/A'}</Text>
                </View>
              </View>
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 10,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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