import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { generalAPI } from '../services/api';

const AnnouncementsScreen = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // READ ONLY - Just fetch existing notices
        const data = await generalAPI.getNotices();
        setNotices(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load notices'
        );
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>School Notices</Text>
      
      {notices.length === 0 ? (
        <View style={styles.noNoticesContainer}>
          <Text style={styles.noNoticesText}>No notices available</Text>
        </View>
      ) : (
        notices.map((notice, index) => (
          <View key={index} style={styles.noticeContainer}>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeDate}>
              {new Date(notice.date).toLocaleDateString()}
            </Text>
            <Text style={styles.noticeContent}>{notice.details}</Text>
            {notice.recipients && notice.recipients.length > 0 && (
              <Text style={styles.noticeRecipients}>
                Recipients: {notice.recipients.length} people
              </Text>
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
    paddingBottom: 120, // Account for TikTok-style tab bar
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
  noNoticesContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  noNoticesText: {
    fontSize: 16,
    color: '#666',
  },
  noticeContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  noticeDate: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 10,
  },
  noticeContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  noticeRecipients: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'right',
  },
});

export default AnnouncementsScreen;