import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Card } from "react-native-paper"

const HomeScreen = () => {
  const dashboardData = {
    totalClients: 150,
    activeLoans: 120,
    newClients: 8,
    repaymentRate: 97,
    totalLoanAmount: 180000,
    averageInterestRate: 5.5,
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.cardContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Total Clientes</Text>
            <Text style={styles.cardValue}>{dashboardData.totalClients}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Préstamos Activos</Text>
            <Text style={styles.cardValue}>{dashboardData.activeLoans}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Nuevos Clientes</Text>
            <Text style={styles.cardValue}>{dashboardData.newClients}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Tasa de Pago</Text>
            <Text style={styles.cardValue}>{dashboardData.repaymentRate}%</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Monto Total de Préstamos</Text>
            <Text style={styles.cardValue}>${dashboardData.totalLoanAmount.toLocaleString()}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Tasa de Interés Promedio</Text>
            <Text style={styles.cardValue}>{dashboardData.averageInterestRate}%</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
  card: {
    width: "48%",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
})

export default HomeScreen

