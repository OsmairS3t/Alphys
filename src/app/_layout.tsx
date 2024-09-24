import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components";
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '../databases/initializeDatabase';

import {
  useFonts,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto';
import theme from '../global/styles/theme';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_700Bold
  });

  // if(!fontsLoaded) {
  //   return <AppLoading />
  // }

  return (
    <ThemeProvider theme={ theme }>
      <SQLiteProvider databaseName='alpys.db' onInit={initializeDatabase}>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </SQLiteProvider>
    </ThemeProvider>
  );
}