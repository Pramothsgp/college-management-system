import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScheduleItemProps {
  id: number;
  time: string;
  title: string;
  location: string;
}

const todaySchedule: ScheduleItemProps[] = [
  { id: 1, time: '09:00 AM', title: 'Class Committee meeting', location: 'Conference Room IT' },
  { id: 2, time: '10:30 AM', title: 'II IT-C', location: 'C6-25' },
  { id: 3, time: '02:00 PM', title: 'III ECE-B', location: 'C2-06' },
  { id: 4, time: '04:00 PM', title: 'II CSE-A', location: 'C1-04' },
];

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <View className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-sm m-1">
    <Text className="text-sm text-gray-600 dark:text-gray-400">{title}</Text>
    <Text className="text-2xl font-bold text-gray-900 dark:text-white">{value}</Text>
  </View>
);

const ScheduleItem = ({ time, title, location }: Omit<ScheduleItemProps, 'id'>) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-3">
      <Text className="text-xs font-semibold text-blue-600 dark:text-blue-400">{time}</Text>
      <Text className="text-base font-medium text-gray-900 dark:text-white">{title}</Text>
      <View className="flex-row items-center mt-1">
        <Ionicons
          name="location-outline"
          size={14}
          color={isDark ? '#9CA3AF' : '#6B7280'}
        />
        <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">{location}</Text>
      </View>
    </View>
  );
};

const StaffDashboard = () => {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {/* Stats Section */}
        <View className="flex-row">
          <StatCard title="Total Attendance" value="90%" />
          <StatCard title="Total Hours" value="160h" />
        </View>

        {/* Today’s Schedule Section */}
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mt-6 mb-2">
          Today’s Schedule
        </Text>

        {todaySchedule.map(({ id, time, title, location }) => (
          <ScheduleItem key={id} time={time} title={title} location={location} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StaffDashboard;
