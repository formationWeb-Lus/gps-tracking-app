import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const { user } = route.params; // récupérer l'utilisateur connecté

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user.prenom} dans l'application GPS Tracking</Text>

      <Button
        title="Voir position véhicule"
        onPress={() => navigation.navigate('Vehicle', { userId: user.id })}
        color="red"
      />
      <Button
        title="Voir historique"
        onPress={() => navigation.navigate('History', { userId: user.id })}
        color="blue"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
});
