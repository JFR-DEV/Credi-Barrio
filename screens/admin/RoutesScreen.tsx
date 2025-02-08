import React, { useState } from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { Card, Button, TextInput } from "react-native-paper"

interface Route {
  id: string
  name: string
  description: string
}

const RoutesScreen = () => {
  const [routes, setRoutes] = useState<Route[]>([
    { id: "1", name: "Ruta 1", description: "Cubre la zona norte de la ciudad" },
    { id: "2", name: "Ruta 2", description: "Cubre la zona sur de la ciudad" },
    { id: "3", name: "Ruta 3", description: "Cubre la zona este de la ciudad" },
  ])
  const [newRoute, setNewRoute] = useState({ name: "", description: "" })

  const addRoute = () => {
    if (newRoute.name && newRoute.description) {
      setRoutes([...routes, { ...newRoute, id: Date.now().toString() }])
      setNewRoute({ name: "", description: "" })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Rutas</Text>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Nombre de la Ruta"
            value={newRoute.name}
            onChangeText={(text) => setNewRoute({ ...newRoute, name: text })}
            style={styles.input}
          />
          <TextInput
            label="Descripción"
            value={newRoute.description}
            onChangeText={(text) => setNewRoute({ ...newRoute, description: text })}
            style={styles.input}
          />
          <Button mode="contained" onPress={addRoute} style={styles.button}>
            Agregar Ruta
          </Button>
        </Card.Content>
      </Card>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.routeCard}>
            <Card.Content>
              <Text style={styles.routeName}>{item.name}</Text>
              <Text style={styles.routeDescription}>{item.description}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  routeCard: {
    marginBottom: 8,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  routeDescription: {
    fontSize: 14,
    color: "#666",
  },
})

export default RoutesScreen

