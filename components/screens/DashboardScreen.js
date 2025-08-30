
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
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

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [studentInfo, setStudentInfo] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [reportCards, setReportCards] = useState([]);
  const [notices, setNotices] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (!user || !user.schoolId) {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
        return;
      }

      // Fetch all data in parallel
      const [studentData, attendanceData, reportCardsData, noticesData, mediaData, paymentsData] = await Promise.all([
        studentAPI.getStudentInfo(user.schoolId),
        studentAPI.getAttendanceStats(user.schoolId),
        studentAPI.getReportCards(user.schoolId).catch(() => []),
        generalAPI.getNotices().catch(() => []),
        generalAPI.getMedia().catch(() => []),
        generalAPI.getStudentPayments(user.schoolId).catch(() => [])
      ]);

      setStudentInfo(studentData);
      setAttendanceStats(attendanceData);
      setReportCards(reportCardsData);
      setNotices(noticesData);
      setMediaItems(mediaData);
      setPayments(paymentsData);

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
      Alert.alert(
        'Error',
        'Failed to load dashboard data. Please try again.'
      );
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(true);
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Hide success message after 3 seconds
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [user]);

  const handleCardPress = (cardName) => {
    switch (cardName) {
      case 'Class':
        navigation.navigate('StudentInfo');
        break;
      case 'Report Cards':
        navigation.navigate('Results');
        break;
      case 'Subjects':
        navigation.navigate('Subjects');
        break;
      case 'Attendance':
        navigation.navigate('Attendance');
        break;
      case 'Payments':
        navigation.navigate('Payments');
        break;
      case 'Media':
        navigation.navigate('Media');
        break;
      case 'Notices':
        navigation.navigate('Notices');
        break;
      default:
        Alert.alert('Card Pressed', `You pressed ${cardName} card.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBack 
        title="Student Dashboard" 
        onBack={() => navigation.goBack()}
        showBackButton={false}
        backgroundColor="#000000"
        textColor="#FFFFFF"
      />

      {showSuccessMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>Student Dashboard loaded</Text>
        </View>
      )}

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
        <View style={styles.welcomeSection}>
          {/* School and Student Header */}
          <View style={styles.schoolStudentHeader}>
            {/* School Info */}
            <View style={styles.schoolInfo}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                style={styles.schoolLogo}
                resizeMode="cover"
              />
              <View style={styles.schoolDetails}>
                <Text style={styles.schoolName}>School Management System</Text>
                <Text style={styles.schoolLocation}>Digital Learning Platform</Text>
              </View>
            </View>
            
            {/* Student Profile Image */}
            <Image
              source={{ uri: studentInfo?.avatar || studentInfo?.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
              style={styles.studentAvatar}
              resizeMode="cover"
            />
          </View>
          
          <Text style={styles.welcomeText}>Welcome back, {studentInfo?.name || user?.name || 'Student'}! 👋</Text>
          <Text style={styles.subtitleText}>
            Track your academic progress and access learning resources
          </Text>
        </View>

        {/* Overview Cards */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewGrid}>
            <TouchableOpacity
              style={styles.overviewCard}
              onPress={() => handleCardPress('Class')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Class</Text>
                <IconSymbol name="school" size={20} color="#8E8E93" />
              </View>
              <Text style={styles.cardValue}>{studentInfo?.sclass?.sclassName || 'N/A'}</Text>
              <Text style={styles.cardSubtext}>Roll No: {studentInfo?.rollNum || 'N/A'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.overviewCard}
              onPress={() => handleCardPress('Report Cards')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Report Cards</Text>
                <IconSymbol name="description" size={20} color="#8E8E93" />
              </View>
              <Text style={styles.cardValue}>{reportCards.length}</Text>
              <Text style={styles.cardSubtext}>Total report cards</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.overviewCard}
              onPress={() => handleCardPress('Subjects')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Subjects</Text>
                <IconSymbol name="book" size={20} color="#8E8E93" />
              </View>
              <Text style={styles.cardValue}>{studentInfo?.subjectsCount || 0}</Text>
              <Text style={styles.cardSubtext}>Total subjects enrolled</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.overviewCard}
              onPress={() => handleCardPress('Attendance')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Attendance</Text>
                <IconSymbol name="check-circle" size={20} color="#8E8E93" />
              </View>
              <Text style={styles.cardValue}>{attendanceStats?.percentage || 0}%</Text>
              <Text style={styles.cardSubtext}>{attendanceStats?.present || 0}/{attendanceStats?.total || 0} days</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.overviewCard}
              onPress={() => handleCardPress('Payments')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Payments</Text>
                <IconSymbol name="credit-card" size={20} color="#8E8E93" />
              </View>
              <Text style={styles.cardValue}>{payments.length}</Text>
              <Text style={styles.cardSubtext}>Total invoices</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.overviewCard}
              onPress={() => handleCardPress('Media')}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Media</Text>
                <IconSymbol name="image" size={20} color="#8E8E93" />
              </View>
              <Text style={styles.cardValue}>{mediaItems.length}</Text>
              <Text style={styles.cardSubtext}>Learning resources</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Tracking */}
        {payments.length > 0 && (
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Tracking</Text>
            <View style={styles.paymentGrid}>
              <TouchableOpacity 
                style={styles.paymentCard}
                onPress={() => navigation.navigate('Payments')}
              >
                <View style={styles.paymentCardHeader}>
                  <Text style={styles.paymentCardTitle}>Total Paid</Text>
                  <View style={styles.paymentIconContainer}>
                    <IconSymbol name="credit-card" size={20} color="#4CAF50" />
                  </View>
                </View>
                <Text style={styles.paymentCardValue}>
                  Shs. {payments.reduce((sum, payment) => sum + (payment.amount || 0), 0).toFixed(0)}
                </Text>
                <Text style={styles.paymentCardSubtext}>
                  {payments.filter(p => p.status === 'Paid').length} payments completed
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.paymentCard}
                onPress={() => navigation.navigate('Payments')}
              >
                <View style={styles.paymentCardHeader}>
                  <Text style={styles.paymentCardTitle}>Pending</Text>
                  <View style={styles.paymentIconContainer}>
                    <IconSymbol name="alert-circle" size={20} color="#FF9800" />
                  </View>
                </View>
                <Text style={styles.paymentCardValue}>
                  {payments.filter(p => p.status === 'Pending').length}
                </Text>
                <Text style={styles.paymentCardSubtext}>
                  Payments pending
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Academic Performance */}
        {studentInfo?.examResult && studentInfo.examResult.length > 0 && (
          <View style={styles.performanceSection}>
            <Text style={styles.sectionTitle}>Academic Performance</Text>
            <View style={styles.performanceGrid}>
              {studentInfo.examResult.slice(0, 4).map((subject, index) => (
                <View key={index} style={styles.performanceCard}>
                  <View style={styles.performanceHeader}>
                    <Text style={styles.subjectName}>{subject.subject?.subName || 'Subject'}</Text>
                    <View style={styles.gradeBadge}>
                      <Text style={styles.gradeText}>
                        {subject.marksObtained?.endTerm || subject.marksObtained?.midTerm || 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.subjectCode}>{subject.subject?.subCode || 'Code'}</Text>
                </View>
              ))}
            </View>
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
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => navigation.navigate('Payments')}
            >
              <IconSymbol name="credit-card" size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>View Payments</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => navigation.navigate('Subjects')}
            >
              <IconSymbol name="book" size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>View Subjects</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => navigation.navigate('Profile')}
            >
              <IconSymbol name="person" size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>My Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Report Cards */}
        {reportCards.length > 0 && (
          <View style={styles.reportCardsSection}>
            <Text style={styles.sectionTitle}>Latest Report Cards</Text>
            <View style={styles.reportCardsGrid}>
              {reportCards.slice(0, 2).map((reportCard, index) => (
                <View key={index} style={styles.reportCard}>
                  <View style={styles.reportCardHeader}>
                    <Text style={styles.reportCardTitle}>Term {reportCard.term || 'N/A'}</Text>
                    <Text style={styles.reportCardYear}>{reportCard.academicYear || 'N/A'}</Text>
                  </View>
                  <View style={styles.reportCardContent}>
                    <View style={styles.reportCardStats}>
                      <View style={styles.reportCardStat}>
                        <Text style={styles.reportCardStatLabel}>Grade</Text>
                        <Text style={styles.reportCardStatValue}>{reportCard.overallGrade || 'N/A'}</Text>
                      </View>
                      <View style={styles.reportCardStat}>
                        <Text style={styles.reportCardStatLabel}>Average</Text>
                        <Text style={styles.reportCardStatValue}>{reportCard.averagePercentage?.toFixed(1) || 'N/A'}%</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.viewDetailsButton}
                      onPress={() => navigation.navigate('Results')}
                    >
                      <Text style={styles.viewDetailsText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Media Section */}
        {mediaItems.length > 0 && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Latest Media</Text>
            <View style={styles.mediaGrid}>
              {mediaItems
                .filter(item => item.category !== "notice")
                .slice(0, 4)
                .map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.mediaCard}
                    onPress={() => navigation.navigate('Media')}
                  >
                    <View style={styles.mediaThumbnail}>
                      {item.type === "image" ? (
                        <Image 
                          source={{ uri: item.thumbnailUrl || item.url }} 
                          style={styles.mediaImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.mediaIconContainer}>
                          <IconSymbol 
                            name={item.type === "video" ? "play-circle" : "description"} 
                            size={24} 
                            color="#8E8E93" 
                          />
                        </View>
                      )}
                    </View>
                    <Text style={styles.mediaTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.mediaDescription} numberOfLines={1}>{item.description}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}

        {/* Notices Section */}
        {notices.length > 0 && (
          <View style={styles.noticesSection}>
            <Text style={styles.sectionTitle}>Recent Notices</Text>
            <View style={styles.noticesList}>
              {notices.slice(0, 3).map((notice, index) => (
                <View key={index} style={styles.noticeCard}>
                  <View style={styles.noticeIconContainer}>
                    <IconSymbol name="notifications" size={20} color="#FF6B6B" />
                  </View>
                  <View style={styles.noticeContent}>
                    <Text style={styles.noticeTitle}>{notice.title}</Text>
                    <Text style={styles.noticeDetails} numberOfLines={2}>{notice.content}</Text>
                    <Text style={styles.noticeDate}>
                      {new Date(notice.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <IconSymbol name="info" size={20} color="#FFD93D" />
              <Text style={styles.activityTitle}>Last Login</Text>
            </View>
            <Text style={styles.activityText}>
              Welcome back! Your dashboard has been updated with the latest information.
            </Text>
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
    paddingBottom: 100,
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
  },
  successMessage: {
    backgroundColor: '#4CAF50',
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  successMessageText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  schoolStudentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  schoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  schoolLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  schoolDetails: {
    flex: 1,
  },
  schoolName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  schoolLocation: {
    color: '#8E8E93',
    fontSize: 14,
  },
  studentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  overviewSection: {
    marginBottom: 30,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtext: {
    color: '#8E8E93',
    fontSize: 12,
  },
  paymentSection: {
    marginBottom: 30,
  },
  paymentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentCardTitle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  paymentIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentCardValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  paymentCardSubtext: {
    color: '#8E8E93',
    fontSize: 12,
  },
  performanceSection: {
    marginBottom: 30,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  gradeBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectCode: {
    color: '#8E8E93',
    fontSize: 12,
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  reportCardsSection: {
    marginBottom: 30,
  },
  reportCardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  reportCardHeader: {
    marginBottom: 16,
  },
  reportCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  reportCardYear: {
    color: '#8E8E93',
    fontSize: 14,
  },
  reportCardContent: {
    alignItems: 'center',
  },
  reportCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  reportCardStat: {
    alignItems: 'center',
  },
  reportCardStatLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 4,
  },
  reportCardStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  viewDetailsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewDetailsText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaSection: {
    marginBottom: 30,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mediaCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  mediaThumbnail: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  mediaIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  mediaDescription: {
    color: '#8E8E93',
    fontSize: 12,
  },
  noticesSection: {
    marginBottom: 30,
  },
  noticesList: {
    gap: 12,
  },
  noticeCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  noticeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  noticeDetails: {
    color: '#8E8E93',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  noticeDate: {
    color: '#8E8E93',
    fontSize: 12,
  },
  recentActivitySection: {
    marginBottom: 30,
  },
  activityCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  activityText: {
    color: '#8E8E93',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DashboardScreen;
