import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useColorScheme } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';

const CustomDrawerContent = ({ navigation, state }: DrawerContentComponentProps) => {
    const {colorScheme} = useColorScheme();
  return (
    <DrawerContentScrollView
      contentContainerStyle={{ flex: 1 }}
      className="bg-white dark:bg-black"
      style={{ padding: 0 , backgroundColor: colorScheme === 'dark' ? "black" : "white"}}
    >
      <View className="px-4 pt-10">
        {state.routeNames.map((route, index) => {
          const isActive = state.index === index;

          return (
            <TouchableOpacity
              key={route}
              onPress={() => navigation.navigate(route)}
              className={`py-3 px-4 rounded-xl mb-2 ${
                isActive ? 'bg-gray-200 dark:bg-gray-800' : ''
              }`}
            >
              <Text
                className={`text-lg font-semibold ${
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {route}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
