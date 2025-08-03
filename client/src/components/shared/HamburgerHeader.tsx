import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { StaffDrawerParamList } from "~/types/navigationProps.type";

const HamburgerHeader = () => {
  const navigation = useNavigation<DrawerNavigationProp<StaffDrawerParamList>>();
  const route = useRoute();

  return (
    <View
      className="flex-row items-center justify-between px-4 pt-2 pt-10 pb-4 bg-white dark:bg-black">
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Text className="text-2xl text-black dark:text-white">☰</Text>
      </TouchableOpacity>

      <View className="absolute left-0 right-0 items-center justify-center ">
        <Text className="text-xl font-semibold text-black dark:text-white mt-6">
          {route.name}
        </Text>
      </View>

      {/* Empty spacer to balance layout */}
      <View className="w-6" />
    </View>
  );
};

export default HamburgerHeader;
