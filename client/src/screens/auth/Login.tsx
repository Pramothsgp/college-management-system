import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '~/context/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
    const [isLoading , setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const handleLogin = async () => {
    console.log('Login pressed:', { username, password, rememberMe });
    try{
        setIsLoading(true);
        await login(username , password);
    }catch(error){
        console.error('Login failed:', error);
    }finally{
        setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password pressed');
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center gap-6 px-6">
          <View className="mb-12 items-center">
            <Text className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              College Management System
            </Text>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</Text>
          </View>

          <View className="gap-y-4 space-y-6">
            <View>
              <TextInput
                className="w-full rounded-xl bg-gray-200 px-4 py-4 text-base text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Username or Email"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            <View>
              <TextInput
                className="w-full rounded-xl bg-gray-200 px-4 py-4 text-base text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  className={`mr-3 h-5 w-5 items-center justify-center rounded border-2 ${
                    rememberMe
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400 bg-transparent dark:border-gray-500'
                  }`}>
                  {rememberMe && <Text className="text-xs font-bold text-white">✓</Text>}
                </TouchableOpacity>
                <Text className="text-base text-gray-700 dark:text-gray-300">Remember Me</Text>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className="mt-6 w-full rounded-xl bg-blue-500 py-4 shadow-lg dark:bg-blue-600"
              activeOpacity={0.8}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-lg font-semibold text-white">Login</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} className="mt-4 items-center">
              <Text className="text-base text-blue-500 dark:text-blue-400">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
