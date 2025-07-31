import './global.css';
import { ThemeProvider, useTheme } from '~/context/ThemeContext';
import { Text, TouchableOpacity, View } from 'react-native';


function HomeContent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">

      <Text className="items-center justify-center mt-8 text-center text-2xl font-bold text-black dark:text-white">
        Welcome to the App!
      </Text>
      <TouchableOpacity 
        onPress={toggleTheme}
        className="mt-4 p-3 rounded bg-blue-500 dark:bg-blue-700"
      >
        <Text className="text-white text-center font-semibold">
          Toggle Theme (Current: {theme})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
