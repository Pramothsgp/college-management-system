import React, { createContext, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

type ThemeType = "light" | "dark";

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
});

const THEME_KEY = "APP_THEME";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>("light");
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        const initialTheme = storedTheme === "dark" ? "dark" : "light";
        setTheme(initialTheme);
        setColorScheme(initialTheme);
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };
    loadStoredTheme();
  }, [setColorScheme]);

  const toggleTheme = async () => {
    const newTheme: ThemeType = theme === "light" ? "dark" : "light";
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
      setTheme(newTheme);
      setColorScheme(newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <View className="flex-1 bg-white dark:bg-gray-900">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
