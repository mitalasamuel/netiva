import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { IconSymbol } from '../ui/IconSymbol';
import TikTokTabBar from '../ui/TikTokTabBar';

// Screens
import AcademicRecordsScreen from '../screens/AcademicRecordsScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';

import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResultsScreen from '../screens/ResultsScreen';
import StudentInfoScreen from '../screens/StudentInfoScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import TimetableScreen from '../screens/TimetableScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 20,
          paddingTop: 12,
          elevation: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarBackground: () => <TikTokTabBar />,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 8,
          marginBottom: 2,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = focused ? 28 : 24;
          
          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Results':
              iconName = focused ? 'book' : 'book';
              break;
            case 'Payments':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Notices':
              iconName = focused ? 'bell' : 'bell-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle';
          }
          
          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 16,
              backgroundColor: focused ? 'rgba(255, 107, 107, 0.15)' : 'transparent',
              minWidth: 44,
              minHeight: 44,
              transform: [{ scale: focused ? 1.1 : 1 }],
            }}>
              <IconSymbol name={iconName} size={iconSize} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="Results" 
        component={ResultsScreen}
        options={{
          title: 'Results',
        }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsScreen}
        options={{
          title: 'Payments',
        }}
      />
      <Tab.Screen 
        name="Notices" 
        component={AnnouncementsScreen}
        options={{
          title: 'Notices',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

function MainNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="StudentInfo" component={StudentInfoScreen} />
      <Stack.Screen name="AcademicRecords" component={AcademicRecordsScreen} />
              <Stack.Screen name="Subjects" component={SubjectsScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="Timetable" component={TimetableScreen} />
    </Stack.Navigator>
  );
}

export default MainNavigator;
