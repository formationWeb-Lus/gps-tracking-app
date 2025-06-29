import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

export default function HistoryScreen() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://backend-ojdz.onrender.com/api/positions')
      .then(response => {
        const today = new Date().toISOString().split('T')[0];
        const filtered = response.data.filter(pos =>
          pos.timestamp.startsWith(today)
        );
        setPositions(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur récupération', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const coordinates = positions.map(p => ({
    latitude: p.latitude,
    longitude: p.longitude
  }));

  if (coordinates.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucune donnée pour aujourd’hui</Text>;
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {coordinates.map((coord, index) => (
        <Marker
          key={index}
          coordinate={coord}
          title={`Arrêt ${index + 1}`}
          description={`Lat: ${coord.latitude}, Long: ${coord.longitude}`}
        />
      ))}
      <Polyline coordinates={coordinates} strokeColor="red" strokeWidth={4} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});
