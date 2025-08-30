
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { getUserProfile } from '../services/authService';
import { IconSymbol } from '../ui/IconSymbol';

const DashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load profile'
        );
      }
    };

    fetchUserProfile();
    
    // Hide success message after 3 seconds
    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>BN</Text>
        <Text style={styles.headerTitle}>Brenda Nakukwago</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <IconSymbol name="refresh" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>BN</Text>
      </View>
      
      {showSuccessMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>Student Dashboard loaded</Text>
        </View>
      )}
      
      <ScrollView style={styles.content}>
        <Text style={styles.welcomeText}>Welcome back, Brenda Nakukwago!</Text>
        <Text style={styles.subtitleText}>Track your academic progress and access learning resources</Text>
        
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Class</Text>
              <IconSymbol name="school" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.cardMainText}>Baby class</Text>
            <Text style={styles.cardSubText}>Roll No. 3</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Report Cards</Text>
              <IconSymbol name="description" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.cardMainText}>1</Text>
            <Text style={styles.cardSubText}>Total report cards</Text>
          </View>
        </View>
        
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Subjects</Text>
              <IconSymbol name="book" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.cardMainText}>4</Text>
            <Text style={styles.cardSubText}>Total subjects enrolled</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Latest Invoice</Text>
              <IconSymbol name="receipt" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.cardMainText}>No invoices</Text>
            <Text style={styles.cardSubText}>Select for payments</Text>
          </View>
        </View>
        
        <View style={styles.paymentSection}>
          <View style={styles.paymentCard}>
            <View style={styles.paymentCardHeader}>
              <Text style={styles.paymentCardTitle}>Total Paid</Text>
              <View style={styles.paymentIconContainer}>
                <IconSymbol name="check-circle" size={24} color="#4CAF50" />
              </View>
            </View>
            <Text style={styles.paymentAmount}>Shs. 0</Text>
            <Text style={styles.paymentSubText}>0 invoices paid</Text>
          </View>
          
          <View style={styles.paymentCard}>
            <View style={styles.paymentCardHeader}>
              <Text style={styles.paymentCardTitle}>Total Due</Text>
              <View style={styles.paymentIconContainer}>
                <IconSymbol name="warning" size={24} color="#FF5252" />
              </View>
            </View>
            <Text style={styles.paymentAmount}>Shs. 0</Text>
            <Text style={styles.paymentSubText}>0 invoices pending</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <IconSymbol name="home" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <IconSymbol name="assessment" size={24} color="#666666" />
          <Text style={styles.navTextInactive}>Results</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <IconSymbol name="notifications" size={24} color="#666666" />
          <Text style={styles.navTextInactive}>Notices</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <IconSymbol name="comment" size={24} color="#666666" />
          <Text style={styles.navTextInactive}>Comments</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <IconSymbol name="payment" size={24} color="#666666" />
          <Text style={styles.navTextInactive}>Payments</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <IconSymbol name="video-library" size={24} color="#666666" />
          <Text style={styles.navTextInactive}>Media</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <IconSymbol name="person" size={24} color="#666666" />
          <Text style={styles.navTextInactive}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#121212',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  refreshButton: {
    padding: 5,
  },
  successMessage: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
  },
  successMessageText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitleText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    width: '48%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  cardMainText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  paymentSection: {
    marginVertical: 10,
  },
  paymentCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentCardTitle: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  paymentIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentAmount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  paymentSubText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
  },
  navTextInactive: {
    color: '#666666',
    fontSize: 10,
    marginTop: 2,
  },
});

export default DashboardScreen;
