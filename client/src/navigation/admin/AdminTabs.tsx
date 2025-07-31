import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={() => <View><Text>Admin Dashboard</Text></View>} />
      <Tab.Screen name="Settings" component={() => <View><Text>Admin Settings</Text></View>} />
      <Tab.Screen name="Profile" component={() => <View><Text>Admin Profile</Text></View>} />
    </Tab.Navigator>
  );
}
