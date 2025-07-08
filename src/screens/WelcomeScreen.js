import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const { height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Titre et icônes */}
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenue sur GPS RDC</Text>
        <View style={styles.iconsRow}>
          <Ionicons name="ios-location-sharp" size={50} color="#FF4D4D" />
          <MaterialIcons name="directions-car" size={50} color="#FF4D4D" />
          <FontAwesome5 name="route" size={50} color="#FF4D4D" />
        </View>
      </View>

      {/* Carte réduite pour laisser place au bouton */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -7.5,
          longitude: 23.5,
          latitudeDelta: 22,
          longitudeDelta: 22,
        }}
      >
        <Marker
          coordinate={{ latitude: -10.7167, longitude: 25.4667 }}
          title="Kolwezi"
          description="Ville minière"
        />
        <Marker
          coordinate={{ latitude: -11.6876, longitude: 27.5026 }}
          title="Lubumbashi"
          description="Ville industrielle"
        />
        <Marker
          coordinate={{ latitude: -4.322447, longitude: 15.30806 }}
          title="Kinshasa"
          description="Capitale de la RDC"
        />
      </MapView>

      {/* Zone de description et bouton */}
      <View style={styles.footer}>
        <Text style={styles.subtitle}>
          Suivez vos véhicules en temps réel, gérez vos trajets facilement et soyez toujours connecté.
        </Text>

        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF4D4D',
    textAlign: 'center',
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginTop: 10,
  },
  map: {
    width: '100%',
    height: height * 0.45, // Réduction de la carte pour que le bouton soit bien visible
    borderRadius: 10,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#FF4D4D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
