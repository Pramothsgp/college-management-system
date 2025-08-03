import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StaffDashboard from '~/screens/staff/StaffDashboard';
import { View, Text } from 'react-native';
import BottomTabsBar from '~/components/shared/BottomTabsBar';
import Settings from '~/screens/shared/Settings';
import HamburgerHeader from '~/components/shared/HamburgerHeader';

const Tab = createBottomTabNavigator();

export default function StaffTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabsBar {...props} />}
      screenOptions={{
        header: () => <HamburgerHeader />
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={StaffDashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={() => <View className="flex-1 justify-center items-center"><Text>Staff Profile</Text></View>}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
