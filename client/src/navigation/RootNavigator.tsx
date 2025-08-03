import { NavigationContainer } from '@react-navigation/native';
import AdminStack from './admin/AdminStack';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '~/context/AuthContext';
import LoginScreen from '~/screens/auth/Login';
import StaffDrawer from './staff/StaffDrawer';

export default function RootNavigator() {
  const { role, isLoading } = useAuth();
  if (isLoading) return <ActivityIndicator className="flex-1 items-center justify-center" />;
  if (!role) return <LoginScreen />;
  return (
    <NavigationContainer>
      {role === 'admin' ? (
        <AdminStack />
      ) : role === 'staff' ? (
        <StaffDrawer />
      ) : (
        <View>
          <Text>Student Navigation</Text>
        </View>
      )}
    </NavigationContainer>
  );
}
