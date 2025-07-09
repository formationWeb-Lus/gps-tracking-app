import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import MainAppNavigator from './MainAppNavigator';
import ThankYouScreen from '../screens/ThankYouScreen';
import ContactScreen from '../screens/ContactScreen';
import EnterCodeScreen from '../screens/EnterCodeScreen';
import HomeScreen from '../screens/HomeScreen';
import VehicleScreen from '../screens/VehicleScreen';      // ✅ Ajouté
import HistoryScreen from '../screens/HistoryScreen';      // ✅ Ajouté

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LiveTracking"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="EnterCode" component={EnterCodeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="MainApp" component={MainAppNavigator} />
        <Stack.Screen name="ThankYou" component={ThankYouScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Vehicle" component={VehicleScreen} />        
        <Stack.Screen name="History" component={HistoryScreen} />        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
