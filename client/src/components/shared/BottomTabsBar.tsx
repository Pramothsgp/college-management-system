import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';


const BottomTabsBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    
    <View
      className={
        'flex-row justify-around items-center py-2 border-t bg-white dark:bg-black border-gray-200 dark:border-gray-700 b-5'
      }
    >
        <View className="flex-1 flex-row justify-around mb-8">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const IconComponent = options.tabBarIcon;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center"
          >
            {IconComponent &&
              IconComponent({
                color: isFocused ? '#3b82f6' : '#9ca3af',
                size: 24,
                focused: isFocused,
              })}
            <Text
              className={`
                'text-xs mt-1',
                ${isFocused
                  ? 'text-blue-500 font-semibold'
                  : 'text-gray-400 dark:text-gray-500'}
              `}
            >
              {typeof options.tabBarLabel === 'function'
                ? options.tabBarLabel({
                    focused: isFocused,
                    color: isFocused ? '#3b82f6' : '#9ca3af',
                    position: 'below-icon',
                    children: route.name,
                  })
                : options.tabBarLabel ?? route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
    </View>
  );
};

export default BottomTabsBar;
