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
import { generalAPI } from '../services/api';
import HeaderWithBack from '../ui/HeaderWithBack';
import { IconSymbol } from '../ui/IconSymbol';

const PaymentsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('All Terms');
  const [selectedYear, setSelectedYear] = useState('All Years');

  const fetchPayments = async (isRefresh = false) => {
    try {
      if (!user?.schoolId) {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
        return;
      }

      const paymentsData = await generalAPI.getStudentPayments(user.schoolId);
      setPayments(paymentsData || []);

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
      Alert.alert(
        'Error',
        'Failed to load payment information. Please try again.'
      );
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments(true);
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  // Get unique academic years from payments
  const academicYears = [...new Set(payments.map(payment => payment.academicYear))].sort().reverse();

  // Filter payments based on selected term and year
  const filteredPayments = payments.filter(payment => {
    const matchesTerm = selectedTerm === 'All Terms' ? true : payment.term === selectedTerm;
    const matchesYear = selectedYear === 'All Years' ? true : payment.academicYear === selectedYear;
    return matchesTerm && matchesYear;
  });

  // Calculate totals
  const totalPaid = filteredPayments.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);
  const totalDue = filteredPayments.reduce((sum, payment) => sum + (payment.remainingAmount || 0), 0);
  const totalInvoices = filteredPayments.length;

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return '#4CAF50';
      case 'Partial':
        return '#2196F3';
      case 'Pending':
        return '#FF9800';
      case 'Overdue':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading payments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBack 
        title="Payments & Invoices" 
        onBack={() => navigation.goBack()}
        backgroundColor="#000000"
        textColor="#FFFFFF"
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
        {/* Refresh Button */}
        <View style={styles.refreshSection}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <View style={styles.loadingSpinner}>
                <IconSymbol name="hourglass-empty" size={16} color="#FFFFFF" />
              </View>
            ) : (
              <IconSymbol name="refresh" size={16} color="#FFFFFF" />
            )}
            <Text style={styles.refreshButtonText}>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* School Header */}
        <View style={styles.schoolHeader}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.schoolLogo}
            resizeMode="cover"
          />
          <View style={styles.schoolInfo}>
            <Text style={styles.schoolName}>School Management System</Text>
            <Text style={styles.schoolLocation}>Digital Learning Platform</Text>
          </View>
        </View>

        {/* Payment Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Payment Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Total Paid</Text>
                <View style={styles.statIconContainer}>
                  <IconSymbol name="credit-card" size={20} color="#4CAF50" />
                </View>
              </View>
              <Text style={styles.statValue}>Shs. {totalPaid.toFixed(0)}</Text>
              <Text style={styles.statSubtext}>
                {filteredPayments.filter(p => p.paymentStatus === 'Paid' || p.paymentStatus === 'Partial').length} invoices with payments
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Total Due</Text>
                <View style={styles.statIconContainer}>
                  <IconSymbol name="receipt" size={20} color="#F44336" />
                </View>
              </View>
              <Text style={styles.statValue}>Shs. {totalDue.toFixed(0)}</Text>
              <Text style={styles.statSubtext}>
                {filteredPayments.filter(p => p.remainingAmount > 0).length} invoices with outstanding amounts
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Total Invoices</Text>
                <View style={styles.statIconContainer}>
                  <IconSymbol name="description" size={20} color="#2196F3" />
                </View>
              </View>
              <Text style={styles.statValue}>{totalInvoices}</Text>
              <Text style={styles.statSubtext}>Termly fee statements</Text>
            </View>
          </View>
        </View>

        {/* Filter Options */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Filter Options</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity 
              style={[styles.filterButton, selectedTerm === 'All Terms' && styles.filterButtonActive]}
              onPress={() => setSelectedTerm('All Terms')}
            >
              <Text style={[styles.filterButtonText, selectedTerm === 'All Terms' && styles.filterButtonTextActive]}>
                All Terms
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedTerm === 'Term 1' && styles.filterButtonActive]}
              onPress={() => setSelectedTerm('Term 1')}
            >
              <Text style={[styles.filterButtonText, selectedTerm === 'Term 1' && styles.filterButtonTextActive]}>
                Term 1
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedTerm === 'Term 2' && styles.filterButtonActive]}
              onPress={() => setSelectedTerm('Term 2')}
            >
              <Text style={[styles.filterButtonText, selectedTerm === 'Term 2' && styles.filterButtonTextActive]}>
                Term 2
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedTerm === 'Term 3' && styles.filterButtonActive]}
              onPress={() => setSelectedTerm('Term 3')}
            >
              <Text style={[styles.filterButtonText, selectedTerm === 'Term 3' && styles.filterButtonTextActive]}>
                Term 3
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Year Filter */}
          <View style={styles.yearFilterSection}>
            <Text style={styles.filterSubtitle}>Academic Year</Text>
            <View style={styles.yearFilterRow}>
              <TouchableOpacity 
                style={[styles.yearFilterButton, selectedYear === 'All Years' && styles.yearFilterButtonActive]}
                onPress={() => setSelectedYear('All Years')}
              >
                <Text style={[styles.yearFilterButtonText, selectedYear === 'All Years' && styles.yearFilterButtonTextActive]}>
                  All Years
                </Text>
              </TouchableOpacity>
              {academicYears.map((year) => (
                <TouchableOpacity 
                  key={year}
                  style={[styles.yearFilterButton, selectedYear === year && styles.yearFilterButtonActive]}
                  onPress={() => setSelectedYear(year)}
                >
                  <Text style={[styles.yearFilterButtonText, selectedYear === year && styles.yearFilterButtonTextActive]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Invoices List */}
        <View style={styles.invoicesSection}>
          <Text style={styles.sectionTitle}>Termly Fee Statements</Text>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.invoiceCard}
                onPress={() => Alert.alert('Invoice Details', `Invoice #${payment.invoiceNumber}\nTerm: ${payment.term}\nAmount: Shs. ${payment.total?.toFixed(0) || 0}\nStatus: ${payment.paymentStatus}`)}
              >
                <View style={styles.invoiceHeader}>
                  <View style={styles.invoiceInfo}>
                    <Text style={styles.invoiceNumber}>#{payment.invoiceNumber}</Text>
                    <Text style={styles.invoiceTerm}>{payment.term} - {payment.academicYear}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.paymentStatus) }]}>
                    <Text style={styles.statusText}>{payment.paymentStatus}</Text>
                  </View>
                </View>
                
                <View style={styles.invoiceDetails}>
                  <View style={styles.invoiceRow}>
                    <Text style={styles.invoiceLabel}>Total Amount:</Text>
                    <Text style={styles.invoiceValue}>Shs. {payment.total?.toFixed(0) || 0}</Text>
                  </View>
                  <View style={styles.invoiceRow}>
                    <Text style={styles.invoiceLabel}>Paid Amount:</Text>
                    <Text style={styles.invoiceValue}>Shs. {payment.paidAmount?.toFixed(0) || 0}</Text>
                  </View>
                  <View style={styles.invoiceRow}>
                    <Text style={styles.invoiceLabel}>Balance:</Text>
                    <Text style={[styles.invoiceValue, { color: payment.remainingAmount > 0 ? '#F44336' : '#4CAF50' }]}>
                      Shs. {payment.remainingAmount?.toFixed(0) || 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.invoiceActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('View Invoice', 'Invoice details would be displayed here')}
                  >
                    <IconSymbol name="visibility" size={16} color="#2196F3" />
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Download', 'Invoice download would start here')}
                  >
                    <IconSymbol name="download" size={16} color="#4CAF50" />
                    <Text style={styles.actionButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="receipt" size={48} color="#8E8E93" />
              <Text style={styles.emptyStateText}>No invoices found</Text>
              <Text style={styles.emptyStateSubtext}>No invoices available for the selected criteria</Text>
            </View>
          )}
        </View>

        {/* Payment Summary */}
        {filteredPayments.length > 0 && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Completed Payments</Text>
                <Text style={styles.summaryValue}>
                  {filteredPayments.filter(p => p.paymentStatus === 'Paid').length}
                </Text>
                <Text style={styles.summarySubtext}>Fully paid invoices</Text>
              </View>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Partial Payments</Text>
                <Text style={styles.summaryValue}>
                  {filteredPayments.filter(p => p.paymentStatus === 'Partial').length}
                </Text>
                <Text style={styles.summarySubtext}>Partially paid invoices</Text>
              </View>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Pending Payments</Text>
                <Text style={styles.summaryValue}>
                  {filteredPayments.filter(p => p.paymentStatus === 'Pending').length}
                </Text>
                <Text style={styles.summarySubtext}>Awaiting payment</Text>
              </View>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Overdue Payments</Text>
                <Text style={styles.summaryValue}>
                  {filteredPayments.filter(p => p.paymentStatus === 'Overdue').length}
                </Text>
                <Text style={styles.summarySubtext}>Past due date</Text>
              </View>
            </View>
          </View>
        )}
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  refreshSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  schoolLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  schoolInfo: {
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
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statSubtext: {
    color: '#8E8E93',
    fontSize: 12,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  yearFilterSection: {
    marginTop: 16,
  },
  filterSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  yearFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  yearFilterButton: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  yearFilterButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  yearFilterButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  yearFilterButtonTextActive: {
    color: '#FFFFFF',
  },
  invoicesSection: {
    marginBottom: 30,
  },
  invoiceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  invoiceTerm: {
    color: '#8E8E93',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  invoiceDetails: {
    marginBottom: 16,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  invoiceValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  invoiceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
  },
  summarySection: {
    marginTop: 20,
    marginBottom: 30,
  },
  summaryGrid: {
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  summaryLabel: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  summarySubtext: {
    color: '#8E8E93',
    fontSize: 12,
  },
});

export default PaymentsScreen;
