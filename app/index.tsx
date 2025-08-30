import { AuthProvider } from '@/components/context/AuthContext';
import MainNavigator from '@/components/navigation/MainNavigator';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
          <MainNavigator />
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
