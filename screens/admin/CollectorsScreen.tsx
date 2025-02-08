import React, { useState } from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { Card, Button, TextInput } from "react-native-paper"

interface Collector {
  id: string
  name: string
  phone: string
  route: string
}

const CollectorsScreen = () => {
  const [collectors, setCollectors] = useState<Collector[]>([
    { id: "1", name: "Juan Pérez", phone: "555-0101", route: "Ruta 1" },
    { id: "2", name: "María García", phone: "555-0102", route: "Ruta 2" },
    { id: "3", name: "Carlos Rodríguez", phone: "555-0103", route: "Ruta 3" },
  ])
  const [newCollector, setNewCollector] = useState({ name: "", phone: "", route: "" })

  const addCollector = () => {
    if (newCollector.name && newCollector.phone && newCollector.route) {
      setCollectors([...collectors, { ...newCollector, id: Date.now().toString() }])
      setNewCollector({ name: "", phone: "", route: "" })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Cobradores</Text>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Nombre del Cobrador"
            value={newCollector.name}
            onChangeText={(text) => setNewCollector({ ...newCollector, name: text })}
            style={styles.input}
          />
          <TextInput
            label="Teléfono"
            value={newCollector.phone}
            onChangeText={(text) => setNewCollector({ ...newCollector, phone: text })}
            style={styles.input}
          />
          <TextInput
            label="Ruta Asignada"
            value={newCollector.route}
            onChangeText={(text) => setNewCollector({ ...newCollector, route: text })}
            style={styles.input}
          />
          <Button mode="contained" onPress={addCollector} style={styles.button}>
            Agregar Cobrador
          </Button>
        </Card.Content>
      </Card>
      <FlatList
        data={collectors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.collectorCard}>
            <Card.Content>
              <Text style={styles.collectorName}>{item.name}</Text>
              <Text style={styles.collectorInfo}>Teléfono: {item.phone}</Text>
              <Text style={styles.collectorInfo}>Ruta: {item.route}</Text>
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
  collectorCard: {
    marginBottom: 8,
  },
  collectorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  collectorInfo: {
    fontSize: 14,
    color: "#666",
  },
})

export default CollectorsScreen

