import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserInfoScreen from '../screens/UserInfoScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import MainAppNavigator from './MainAppNavigator';
import ThankYouScreen from '../screens/ThankYouScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserInfo" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="MainApp" component={MainAppNavigator} />
        <Stack.Screen name="ThankYou" component={ThankYouScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
