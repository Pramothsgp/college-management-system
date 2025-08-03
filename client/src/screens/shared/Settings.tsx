import { View, Text, Switch, TouchableOpacity, Alert } from 'react-native'
import { useTheme } from '~/context/ThemeContext'
import { useAuth } from '~/context/AuthContext';

const Settings = () => {
    const { theme , toggleTheme} = useTheme();
    const {logout} = useAuth();
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
            console.log("User logged out")
          }
        }
      ]
    )
  }

  return (
    <View className='flex-1 bg-white dark:bg-black p-4'>
      {/* Header */}
      <Text className='text-2xl font-bold text-gray-900 dark:text-white mb-8 mt-4'>
        Settings
      </Text>

      {/* Dark Mode Setting */}
      <View className='bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700'>
        <View className='flex-row items-center justify-between'>
          <View className='flex-1'>
            <Text className='text-lg font-semibold text-gray-900 dark:text-white'>
              Dark Mode
            </Text>
            <Text className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              Toggle between light and dark theme
            </Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ 
              false: '#e5e7eb', 
              true: '#3b82f6' 
            }}
            thumbColor={theme === 'dark' ? '#ffffff' : '#000'}
            ios_backgroundColor="#e5e7eb"
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        className='bg-red-500 dark:bg-red-600 rounded-lg p-4 mt-8 active:bg-red-600 dark:active:bg-red-700'
        activeOpacity={0.8}
      >
        <Text className='text-white text-center text-lg font-semibold'>
          Logout
        </Text>
      </TouchableOpacity>

      {/* Additional Settings Placeholder */}
      <View className='bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mt-4 border border-gray-200 dark:border-gray-700'>
        <Text className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
          Other Settings
        </Text>
        <Text className='text-sm text-gray-600 dark:text-gray-400'>
          Additional settings can be added here
        </Text>
      </View>
    </View>
  )
}

export default Settings
