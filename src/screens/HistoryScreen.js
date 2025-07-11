import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen({ route }) {
  const [historique, setHistorique] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [userId, setUserId] = useState(null);

  const formattedDate = date.toISOString().slice(0, 10);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        if (route.params?.userId) {
          setUserId(route.params.userId);
        } else {
          const userData = await AsyncStorage.getItem('user');
          const user = JSON.parse(userData);
          setUserId(user?.id);
        }
      } catch (err) {
        console.error('Erreur récupération userId:', err);
        setUserId(null);
      }
    };

    loadUserId();
  }, [route.params]);

  useEffect(() => {
    if (userId) fetchData();
  }, [date, userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://backend-ojdz.onrender.com/api/positions/history`,
        {
          params: { userId, date: formattedDate },
        }
      );

      if (response.data && Object.keys(response.data).length > 0) {
        setHistorique(response.data);
      } else {
        setHistorique(null);
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement :', err.message);
      setHistorique(null);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  if (loading) return <ActivityIndicator size="large" color="red" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container}>
      <Button
        title={`📅 Choisir la date (${formattedDate})`}
        onPress={() => setShowPicker(true)}
      />

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
        <Text style={styles.noData}>❌ Aucune donnée pour cette date.</Text>
      ) : (
        <>
          <Text style={styles.title}>🧭 Historique du {historique.date || formattedDate}</Text>
          <Text style={styles.info}>🚗 Véhicule : {historique.vehicule || 'Non défini'}</Text>
          <Text style={styles.info}>📏 Distance : {historique.distance_km || 0} km</Text>
          <Text style={styles.info}>🕒 Départ : {historique.start_time || '--:--'}</Text>
          <Text style={styles.info}>🕓 Fin : {historique.end_time || '--:--'}</Text>
          <Text style={styles.info}>⛔ Arrêts : {historique.total_stops || 0}</Text>
          <Text style={styles.info}>⏱ Temps d'arrêt : {historique.total_stop_time || '00:00:00'}</Text>

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
                  coordinate={{
                    latitude: pos.latitude,
                    longitude: pos.longitude,
                  }}
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
            <Text style={styles.noData}>❗Aucune position disponible.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  info: { fontSize: 16, marginVertical: 2 },
  map: { height: 300, marginTop: 20, borderRadius: 10 },
  noData: { marginTop: 20, textAlign: 'center', fontSize: 16, color: 'red' },
});
