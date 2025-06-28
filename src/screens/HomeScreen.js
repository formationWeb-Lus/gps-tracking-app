import { View, Text, Button } from 'react-native';
import { ROUTES } from '../routes'; // ← import des routes

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Bienvenue dans l'app GPS Tracking</Text>
      <Button title="Voir véhicules" onPress={() => navigation.navigate(ROUTES.VEHICLES)} />
      <Button title="Voir historique" onPress={() => navigation.navigate(ROUTES.HISTORY)} />
    </View>
  );
}
