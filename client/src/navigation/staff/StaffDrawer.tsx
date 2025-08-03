import StaffTabs from './StaffTabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, View } from 'react-native';
import CustomDrawerContent from '~/components/shared/CustomDrawerContent';
import HamburgerHeader from '~/components/shared/HamburgerHeader';


const Drawer = createDrawerNavigator();

export default function StaffDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        header: () => <HamburgerHeader />
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={StaffTabs} options={{ headerShown: false }} />
      <Drawer.Screen name="Profile" component={() => <View><Text>Profile</Text></View>} />
      <Drawer.Screen name="Settings" component={() => <View><Text>Settings</Text></View>} />
      <Drawer.Screen name="Reports" component={() => <View><Text>Reports</Text></View>} />
    </Drawer.Navigator>
  );
}