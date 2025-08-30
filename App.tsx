/**
 * School Management Parents Portal
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { ExpoRoot } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#000000" />
      <ExpoRoot context={require.context('./app')} />
    </>
  );
}