import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button, Platform, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HistoryScreen() {
  const [historique, setHistorique] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const vehiculeId = 'Toyota';
  const formattedDate = date.toISOString().slice(0, 10);

  const fetchData = async () => {
  try {
    const response = await axios.get(`https://backend-ojdz.onrender.com/api/positions?userId=${userId}`);
    setPositions(response.data || []);
  } catch (err) {
    console.error('❌ Erreur lors du chargement :', err.message);
  } finally {
    setLoading(false);
  }
};
  

  useEffect(() => {
    fetchData();
  }, [date]);

  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  if (loading) return <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container}>
      <Button title={`📅 Choisir la date (${formattedDate})`} onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}

      {!historique ? (
        <Text style={{ marginTop: 20 }}>❌ Aucune donnée pour cette date.</Text>
      ) : (
        <>
          <Text style={styles.title}>🧭 Historique du {historique.date}</Text>
          <Text style={styles.info}>🚗 Véhicule : {historique.vehicule}</Text>
          <Text style={styles.info}>📏 Distance : {historique.distance_km} km</Text>
          <Text style={styles.info}>🕒 Départ : {historique.start_time}</Text>
          <Text style={styles.info}>🕓 Fin : {historique.end_time}</Text>
          <Text style={styles.info}>⛔ Arrêts : {historique.total_stops}</Text>
          <Text style={styles.info}>⏱ Temps d'arrêt : {historique.total_stop_time}</Text>

          {historique.positions?.length ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: historique.positions[0].latitude,
                longitude: historique.positions[0].longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {historique.positions.map((pos, index) => (
                <Marker
                  key={index}
                  coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
                  title={`Arrêt ${index + 1}`}
                  description={`${pos.quartier || ''}, ${pos.avenue || ''} (${pos.duree || ''})`}
                  pinColor="blue"
                />
              ))}

              <Polyline
                coordinates={historique.positions.map(p => ({
                  latitude: p.latitude,
                  longitude: p.longitude,
                }))}
                strokeColor="red"
                strokeWidth={3}
              />
            </MapView>
          ) : (
            <Text style={{ marginTop: 10 }}>❗Aucune position disponible.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  info: { fontSize: 16, marginVertical: 2 },
  map: { height: 300, marginTop: 20, borderRadius: 10 },
});
