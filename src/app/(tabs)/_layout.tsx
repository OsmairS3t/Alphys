import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Header from './header';

export default function TabLayout() {
  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'blue',
          headerTintColor: '#fff',
        }}
      >
        <Tabs.Screen name="header" options={{ href: null }} />
        <Tabs.Screen
          name="register"
          options={{
            title: 'Cadastros',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="list-alt" color={color} />,
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="stock"
          options={{
            title: 'Estoque',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}