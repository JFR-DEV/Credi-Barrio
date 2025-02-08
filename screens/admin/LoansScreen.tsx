import React, { useState } from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { Card, Button, TextInput, Menu } from "react-native-paper"

interface Loan {
  id: string
  clientName: string
  amount: number
  status: string
}

const LoansScreen = () => {
  const [loans, setLoans] = useState<Loan[]>([
    { id: "1", clientName: "Juan Pérez", amount: 1000, status: "Activo" },
    { id: "2", clientName: "María García", amount: 1500, status: "Activo" },
    { id: "3", clientName: "Carlos Rodríguez", amount: 800, status: "Completado" },
  ])
  const [newLoan, setNewLoan] = useState({ clientName: "", amount: "" })
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)

  const addLoan = () => {
    if (newLoan.clientName && newLoan.amount) {
      setLoans([
        ...loans,
        {
          ...newLoan,
          id: Date.now().toString(),
          amount: Number.parseFloat(newLoan.amount),
          status: "Activo",
        },
      ])
      setNewLoan({ clientName: "", amount: "" })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Préstamos</Text>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Nombre del Cliente"
            value={newLoan.clientName}
            onChangeText={(text) => setNewLoan({ ...newLoan, clientName: text })}
            style={styles.input}
          />
          <TextInput
            label="Monto del Préstamo"
            value={newLoan.amount}
            onChangeText={(text) => setNewLoan({ ...newLoan, amount: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={addLoan} style={styles.button}>
            Agregar Préstamo
          </Button>
        </Card.Content>
      </Card>
      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.loanCard}>
            <Card.Content>
              <Text style={styles.loanName}>{item.clientName}</Text>
              <Text style={styles.loanAmount}>Monto: ${item.amount}</Text>
              <Text style={styles.loanStatus}>Estado: {item.status}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() => {
                  setSelectedLoan(item.id)
                  setMenuVisible(true)
                }}
              >
                Opciones
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
      <Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={<View />}>
        <Menu.Item
          onPress={() => {
            // Lógica para editar préstamo
            setMenuVisible(false)
          }}
          title="Editar"
        />
        <Menu.Item
          onPress={() => {
            // Lógica para marcar como completado
            setMenuVisible(false)
          }}
          title="Marcar como Completado"
        />
        <Menu.Item
          onPress={() => {
            // Lógica para eliminar préstamo
            setMenuVisible(false)
          }}
          title="Eliminar"
        />
      </Menu>
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
  loanCard: {
    marginBottom: 8,
  },
  loanName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loanAmount: {
    fontSize: 14,
    color: "#666",
  },
  loanStatus: {
    fontSize: 14,
    color: "#666",
  },
})

export default LoansScreen

