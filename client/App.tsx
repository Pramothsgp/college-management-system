import './global.css';
import { ThemeProvider, useTheme } from '~/context/ThemeContext';
import { Text, TouchableOpacity, View } from 'react-native';
import RootNavigator from '~/navigation/RootNavigator';
import { AuthProvider } from '~/context/AuthContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
