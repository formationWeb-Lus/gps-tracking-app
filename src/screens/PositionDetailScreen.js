import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function PositionDetailScreen({ route }) {
  const { positions } = route.params;
  const [clientLocation, setClientLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission refusée pour accéder à la localisation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setClientLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const toRad = deg => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); // Distance en mètres
  };

  if (!clientLocation) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Chargement de votre position...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {positions.map((pos, index) => {
        const distance = getDistance(
          clientLocation.latitude,
          clientLocation.longitude,
          pos.latitude,
          pos.longitude
        );

        return (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>📍 Position {index + 1}</Text>
            <Text>Latitude: {pos.latitude}</Text>
            <Text>Longitude: {pos.longitude}</Text>
            <Text>Vitesse: {pos.vitesse} km/h</Text>
            <Text>Date: {new Date(pos.timestamp).toLocaleString()}</Text>
            <Text>Quartier: {pos.quartier}</Text>
            <Text>Ville: {pos.ville}</Text>
            <Text>Pays: {pos.pays}</Text>
            <Text style={styles.distance}>📏 Distance: {distance} m</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  distance: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});
