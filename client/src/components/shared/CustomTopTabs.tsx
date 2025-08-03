import {  MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { View, Text, TouchableOpacity } from 'react-native';


export function CustomTopTabBar({ state, descriptors, navigation } : MaterialTopTabBarProps) {
  return (
    <View className="flex-row bg-white dark:bg-black">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            className={`flex-1 items-center py-3 ${isFocused ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => navigation.navigate(route.name)}
          >
            <Text className={`${isFocused ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}>
              {typeof label === 'function'
                ? label({
                    focused: isFocused,
                    color: isFocused ? '#3B82F6' : '#6B7280',
                    children: route.name,
                  })
                : label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

