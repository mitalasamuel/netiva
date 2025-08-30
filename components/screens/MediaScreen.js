import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';

const MediaScreen = () => {
  const [mediaItems] = useState([
    { id: 1, title: 'School Event Photos', type: 'Photos', date: '2025-08-20' },
    { id: 2, title: 'Parent-Teacher Meeting Recording', type: 'Video', date: '2025-08-15' },
    { id: 3, title: 'School Newsletter August 2025', type: 'Document', date: '2025-08-01' },
    { id: 4, title: 'Annual Day Performance', type: 'Video', date: '2025-07-20' },
    { id: 5, title: 'Classroom Activities', type: 'Photos', date: '2025-07-10' },
  ]);

  const handleMediaPress = (item) => {
    Alert.alert(
      'Media Access',
      `Accessing ${item.title}. In a real app, this would open the media content.`,
      [
        { text: 'OK' }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>School Media Library</Text>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Documents</Text>
        </TouchableOpacity>
      </View>
      
      {mediaItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.mediaContainer}
          onPress={() => handleMediaPress(item)}
        >
          <View style={styles.mediaIcon}>
            <Text style={styles.mediaIconText}>
              {item.type === 'Photos' ? '🖼️' : item.type === 'Video' ? '🎬' : '📄'}
            </Text>
          </View>
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaTitle}>{item.title}</Text>
            <Text style={styles.mediaType}>{item.type} • {item.date}</Text>
          </View>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  mediaContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mediaIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  mediaIconText: {
    fontSize: 24,
  },
  mediaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mediaType: {
    fontSize: 14,
    color: '#666',
  },
});

export default MediaScreen;