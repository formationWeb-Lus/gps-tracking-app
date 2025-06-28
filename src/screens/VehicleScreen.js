import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function VehicleScreen() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPositions = async () => {
    try {
      const response = await fetch("http://192.168.240.129:3000/api/positions"); // ← Ton IP locale ici
      const data = await response.json();
      setPositions(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur de chargement des positions :", error);
    }
  };

  useEffect(() => {
    fetchPositions(); // Appel initial
    const interval = setInterval(fetchPositions, 5000); // Toutes les 5s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: positions[0]?.latitude || -4.325,
          longitude: positions[0]?.longitude || 15.322,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {positions.map((pos) => (
          <Marker
            key={pos._id}
            coordinate={{
              latitude: pos.latitude,
              longitude: pos.longitude,
            }}
            title={pos.vehiculeId}
            description={`Dernière position : ${new Date(pos.timestamp).toLocaleString()}\nVitesse : ${pos.vitesse || 0} km/h`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
