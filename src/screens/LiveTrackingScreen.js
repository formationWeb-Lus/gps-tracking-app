import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function LiveTrackingScreen({ navigation }) {
  const mapRef = useRef(null);
  const scaleKolwezi = useRef(new Animated.Value(1)).current;
  const scaleLikasi = useRef(new Animated.Value(1)).current;
  const scaleLubu = useRef(new Animated.Value(1)).current;

  const markers = [
    {
      id: 'kolwezi',
      coord: { latitude: -10.7167, longitude: 25.4667 },
      anim: scaleKolwezi,
    },
    {
      id: 'likasi',
      coord: { latitude: -10.9833, longitude: 26.7333 },
      anim: scaleLikasi,
    },
    {
      id: 'lubumbashi',
      coord: { latitude: -11.6600, longitude: 27.4794 },
      anim: scaleLubu,
    },
  ];

  useEffect(() => {
    // Animation des points
    markers.forEach((m) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(m.anim, {
            toValue: 1.8,
            duration: 700,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(m.anim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ).start();
    });

    // Centrer et ajuster le zoom pour les 3 villes
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(markers.map((m) => m.coord), {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {markers.map((m) => (
          <Marker key={m.id} coordinate={m.coord}>
            <Animated.View style={[styles.pulse, { transform: [{ scale: m.anim }] }]} />
          </Marker>
        ))}
      </MapView>

      {/* ✅ BOUTON visible et déplacé plus haut */}
      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.buttonText}>🚀 Prêt à passer à l'action ? Cliquez ici</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  pulse: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: '#fff',
  },
  actionButton: {
    position: 'absolute',
    bottom: 150, // ✅ Positionné plus haut (au lieu de 30)
    left: 20,
    right: 20,
    backgroundColor: '#FF4D4D', // ✅ Rouge professionnel
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
