import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Header from './header';
import { useTheme } from 'styled-components';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarInactiveTintColor: theme.colors.secondary_light,
          tabBarActiveTintColor: theme.colors.secondary,
          tabBarStyle: {
            height: 50,
            backgroundColor: theme.colors.background,
            borderWidth: 0,
            borderColor: theme.colors.secondary,
        },
        }}
      >
        <Tabs.Screen name="header" options={{ href: null }} />
        <Tabs.Screen
          name="register"
          options={{
            title: 'CADASTROS',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="list-alt" color={color} />,
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'HOME',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="stock"
          options={{
            title: 'ESTOQUE',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="receipt"
          options={{
            title: 'RECEBER',
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="money" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}