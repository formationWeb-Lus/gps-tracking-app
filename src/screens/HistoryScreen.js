import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const { height } = Dimensions.get('window');

export default function HistoryScreen() {
  const [historiques, setHistoriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [vehiculeId, setVehiculeId] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('vehiculeToken');
        if (storedToken) {
          setToken(storedToken);
          const decoded = jwtDecode(storedToken);
          setVehiculeId(decoded.vehiculeId);
        } else {
          console.warn('❌ Aucun token JWT trouvé pour le véhicule');
        }
      } catch (err) {
        console.error('❌ Erreur lors du chargement du token :', err.message);
      }
    };

    loadToken();
  }, []);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://gps-device-server.onrender.com/api/historiques',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistoriques(response.data || []);
    } catch (err) {
      console.error('❌ Erreur lors du chargement :', err.response?.data || err.message);
      setHistoriques([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="red" style={styles.loading} />}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {historiques.length === 0 ? (
          <Text style={styles.noData}>❌ Aucun historique trouvé.</Text>
        ) : (
          historiques.map((h, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.title}>🧭 Historique du {h.date}</Text>
              <Text style={styles.info}>🚗 Véhicule : {vehiculeId || h.vehiculeid}</Text>
              <Text style={styles.info}>📏 Distance : {h.distance_km} km</Text>
              <Text style={styles.info}>🕒 Départ : {h.start_time}</Text>
              <Text style={styles.info}>🕓 Fin : {h.end_time}</Text>
              <Text style={styles.info}>⛔ Arrêts : {h.total_stops}</Text>
              <Text style={styles.info}>⏱ Temps d'arrêt : {h.total_stop_time}</Text>

              {h.positions?.length > 0 ? (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: h.positions[0].latitude,
                    longitude: h.positions[0].longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                >
                  {h.positions.map((pos, i) => (
                    <Marker
                      key={i}
                      coordinate={{ latitude: pos.latitude, longitude: pos.longitude }}
                      title={`Point ${i + 1}`}
                      description={`${pos.quartier || ''}, ${pos.ville || ''}`}
                      pinColor="blue"
                    />
                  ))}
                  <Polyline
                    coordinates={h.positions.map(p => ({
                      latitude: p.latitude,
                      longitude: p.longitude,
                    }))}
                    strokeColor="red"
                    strokeWidth={3}
                  />
                </MapView>
              ) : (
                <Text style={styles.noData}>⚠️ Aucun point GPS enregistré.</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    marginTop: height / 2 - 40,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  card: {
    marginBottom: 25,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  info: {
    fontSize: 15,
    marginVertical: 1,
  },
  map: {
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  noData: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
});
