import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView } from 'react-native';
import MapView from 'react-native-maps';

export default function VehicleScreen() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend-ojdz.onrender.com/api/positions');
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error('Erreur de chargement :', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Carte affichée dès le départ */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -4.325,
          longitude: 15.322,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />

      {/* Bouton rouge */}
      <View style={styles.buttonContainer}>
        <Button title="🔴 Voir Position Véhicule" onPress={fetchData} color="red" />
      </View>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 10 }} />}

      {/* Résultat sous forme de texte */}
      <ScrollView style={styles.results}>
        {positions.map((item) => (
          <View key={item._id} style={styles.card}>
            <Text>🚗 Véhicule : {item.vehiculeId}</Text>
            <Text>📍 Latitude : {item.latitude}</Text>
            <Text>📍 Longitude : {item.longitude}</Text>
            <Text>⚡ Vitesse : {item.vitesse} km/h</Text>
            <Text>🕒 {new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { height: 250 },
  buttonContainer: { margin: 10 },
  results: { flex: 1, paddingHorizontal: 10 },
  card: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
});
