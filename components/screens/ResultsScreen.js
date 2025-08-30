import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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

const ResultsScreen = ({ navigation }) => {
  const [reportCards, setReportCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportCard, setSelectedReportCard] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReportCards = async () => {
      if (!user?.schoolId) {
        setLoading(false);
        Alert.alert('Error', 'No student ID available');
        return;
      }

      try {
        const data = await studentAPI.getReportCards(user.schoolId);
        setReportCards(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load report cards'
        );
      }
    };

    fetchReportCards();
  }, [user?.schoolId]);

  const handleReportCardPress = async (reportCard) => {
    try {
      // Fetch student information
      const studentData = await studentAPI.getStudentInfo(user.schoolId);
      setStudentInfo(studentData);
      setSelectedReportCard(reportCard);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching student info:', error);
      setStudentInfo(null);
      setSelectedReportCard(reportCard);
      setModalVisible(true);
    }
  };

  const handleDownload = async (type = 'EOT') => {
    if (!selectedReportCard) return;
    
    setDownloading(true);
    try {
      // This would call your PDF generation API
      Alert.alert('Download', `${type} report card download started`);
      // Implement actual download logic here
    } catch (error) {
      Alert.alert('Error', 'Failed to download report card');
    } finally {
      setDownloading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReportCard(null);
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
        title="Report Cards" 
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        {reportCards.length === 0 ? (
          <View style={styles.noDataContainer}>
            <IconSymbol name="description" size={64} color="#ccc" />
            <Text style={styles.noDataText}>No report cards available</Text>
            <Text style={styles.noDataSubtext}>Report cards will appear here once published by your teachers</Text>
          </View>
        ) : (
          reportCards.map((reportCard, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reportCardContainer}
              onPress={() => handleReportCardPress(reportCard)}
            >
              <View style={styles.reportCardHeader}>
                <View style={styles.reportCardTitle}>
                  <Text style={styles.termText}>Term {reportCard.term}</Text>
                  <Text style={styles.academicYearText}>{reportCard.academicYear}</Text>
                </View>
                <View style={styles.reportCardStatus}>
                  <Text style={[
                    styles.statusText,
                    reportCard.status === 'Published' ? styles.published : styles.draft
                  ]}>
                    {reportCard.status}
                  </Text>
                </View>
              </View>

              <View style={styles.reportCardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Class:</Text>
                  <Text style={styles.detailValue}>{reportCard.sclass?.sclassName || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Subjects:</Text>
                  <Text style={styles.detailValue}>{reportCard.subjects?.length || 0}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Average:</Text>
                  <Text style={styles.detailValue}>{reportCard.averagePercentage || 0}%</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Grade:</Text>
                  <Text style={styles.detailValue}>{reportCard.overallGrade || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.reportCardFooter}>
                <Text style={styles.publishedDate}>
                  Published: {reportCard.publishedDate ? new Date(reportCard.publishedDate).toLocaleDateString() : 'N/A'}
                </Text>
                <IconSymbol name="arrow-forward" size={20} color="#007bff" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Report Card Detail Modal - Pull-up Sheet Style */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Pull Handle */}
            <View style={styles.pullHandle}>
              <View style={styles.pullHandleBar} />
            </View>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Term {selectedReportCard?.term} Report Card</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollContent}>
              {selectedReportCard && (
                <View style={styles.reportCardDetail}>

                  
                  {/* Student Information */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Student Information</Text>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Name:</Text>
                        <Text style={styles.infoValue}>{studentInfo?.name || user?.name || 'N/A'}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Roll No:</Text>
                        <Text style={styles.infoValue}>{studentInfo?.rollNum || user?.schoolId || 'N/A'}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Class:</Text>
                        <Text style={styles.infoValue}>{studentInfo?.sclass?.sclassName || selectedReportCard.sclass?.sclassName || 'N/A'}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Term:</Text>
                        <Text style={styles.infoValue}>{selectedReportCard.term}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Academic Year:</Text>
                        <Text style={styles.infoValue}>{selectedReportCard.academicYear}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Academic Performance */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Academic Performance</Text>
                    <View style={styles.performanceTable}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderCell}>Subject</Text>
                        <Text style={styles.tableHeaderCell}>BOT</Text>
                        <Text style={styles.tableHeaderCell}>MID</Text>
                        <Text style={styles.tableHeaderCell}>HP</Text>
                        <Text style={styles.tableHeaderCell}>WW</Text>
                        <Text style={styles.tableHeaderCell}>EOT</Text>
                        <Text style={styles.tableHeaderCell}>Grade</Text>
                      </View>
                      
                      {selectedReportCard.subjects?.map((subject, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={styles.tableCell}>{subject.subject?.subName || 'N/A'}</Text>
                          <Text style={styles.tableCell}>{subject.assessments?.BOT || '-'}</Text>
                          <Text style={styles.tableCell}>{subject.assessments?.MID || '-'}</Text>
                          <Text style={styles.tableCell}>{subject.assessments?.HP || '-'}</Text>
                          <Text style={styles.tableCell}>{subject.assessments?.WW || '-'}</Text>
                          <Text style={styles.tableCell}>{subject.assessments?.EOT || '-'}</Text>
                          <Text style={styles.tableCell}>{subject.grade || '-'}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Remarks */}
                  {(selectedReportCard.classTeacherRemarks || selectedReportCard.principalRemarks) && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Remarks</Text>
                      {selectedReportCard.classTeacherRemarks && (
                        <View style={styles.remarkItem}>
                          <Text style={styles.remarkLabel}>Class Teacher:</Text>
                          <Text style={styles.remarkText}>{selectedReportCard.classTeacherRemarks}</Text>
                        </View>
                      )}
                      {selectedReportCard.principalRemarks && (
                        <View style={styles.remarkItem}>
                          <Text style={styles.remarkLabel}>Principal:</Text>
                          <Text style={styles.remarkText}>{selectedReportCard.principalRemarks}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Download Buttons */}
            <View style={styles.downloadSection}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownload('EOT')}
                disabled={downloading}
              >
                <IconSymbol name="download" size={20} color="#fff" />
                <Text style={styles.downloadButtonText}>End of Term</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownload('MID')}
                disabled={downloading}
              >
                <IconSymbol name="download" size={20} color="#fff" />
                <Text style={styles.downloadButtonText}>Mid Term</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  reportCardContainer: {
    backgroundColor: '#1C1C1E',
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  reportCardTitle: {
    flex: 1,
  },
  termText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  academicYearText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  reportCardStatus: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  published: {
    color: '#4CAF50',
  },
  draft: {
    color: '#FFC107',
  },
  reportCardDetails: {
    marginBottom: 15,
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
  reportCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  publishedDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalScrollContent: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  reportCardDetail: {
    paddingBottom: 20,
  },

  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  infoGrid: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  performanceTable: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  remarkItem: {
    marginBottom: 15,
  },
  remarkLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  remarkText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  downloadSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  pullHandle: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  pullHandleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#8E8E93',
    borderRadius: 3,
    opacity: 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default ResultsScreen;
