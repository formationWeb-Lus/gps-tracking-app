import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

export default function HistoryScreen() {
  const [historique, setHistorique] = useState(null);
  const [loading, setLoading] = useState(true);

  const vehiculeId = 'Toyota'; // à personnaliser si nécessaire
  const date = '2025-06-28'; // à rendre dynamique plus tard

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://backend-ojdz.onrender.com/api/historique/${vehiculeId}/${date}`);
        setHistorique(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement de l’historique :', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  if (!historique) return <Text>Pas de données pour ce véhicule.</Text>;

  const positions = historique.positions || [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Historique du {historique.date}</Text>
      <Text style={styles.info}>Véhicule : {historique.vehicule}</Text>
      <Text style={styles.info}>Distance : {historique.distance_km} km</Text>
      <Text style={styles.info}>Heure de départ : {historique.start_time}</Text>
      <Text style={styles.info}>Heure de fin : {historique.end_time}</Text>
      <Text style={styles.info}>Arrêts : {historique.total_stops}</Text>
      <Text style={styles.info}>Temps total d'arrêt : {historique.total_stop_time}</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: positions[0]?.latitude || -4.3,
          longitude: positions[0]?.longitude || 15.3,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {positions.map((pos, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
            title={`Stop ${index + 1}`}
            description={`${pos.quartier || ''}, ${pos.avenue || ''} (${pos.duree || ''})`}
          />
        ))}

        <Polyline
          coordinates={positions.map(p => ({ latitude: p.latitude, longitude: p.longitude }))}
          strokeColor="red"
          strokeWidth={3}
        />
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 16, marginVertical: 2 },
  map: { height: 300, marginTop: 20, borderRadius: 10 },
});
