import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { Text, View } from "react-native";
import { CustomTopTabBar } from "~/components/shared/CustomTopTabs";

const Tab = createMaterialTopTabNavigator();

const AttendanceTabs = () => {
  return (
    <Tab.Navigator
    tabBar={CustomTopTabBar}
    >
        <Tab.Screen name="Mark Attendance" component={() => <View className="flex-1 justify-center items-center"><Text>Mark Attendance</Text></View>} />
        <Tab.Screen name="View Attendance" component={() => <View className="flex-1 justify-center items-center"><Text>Mark Attendance</Text></View>} />
    </Tab.Navigator>
  )
}

export default AttendanceTabs