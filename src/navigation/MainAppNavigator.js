import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import VehicleScreen from '../screens/VehicleScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function MainAppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Stack.Screen name="Vehicle" component={VehicleScreen} options={{ title: 'Position Actuelle' }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Historique' }} />
    </Stack.Navigator>
  );
}
