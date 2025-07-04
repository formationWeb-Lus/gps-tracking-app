import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // utiliser expo/vector-icons

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur GPS RDC</Text>
      <View style={styles.iconsRow}>
        <Ionicons name="ios-location-sharp" size={60} color="#FF4D4D" />
        <MaterialIcons name="directions-car" size={60} color="#FF4D4D" />
        <FontAwesome5 name="route" size={60} color="#FF4D4D" />
      </View>
      <Text style={styles.subtitle}>
        Suivez vos véhicules en temps réel, gérez vos trajets facilement et soyez toujours connecté.
      </Text>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }} // icône GPS ou tracking
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserInfo')}
      >
        <Text style={styles.buttonText}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF4D4D',
    textAlign: 'center',
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  image: {
    width: 180,
    height: 180,
  },
  button: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#FF4D4D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
