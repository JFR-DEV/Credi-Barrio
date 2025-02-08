import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface RoleSelectionScreenProps {
  setUserRole: (role: "admin" | "collector") => void
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ setUserRole }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Paga-Fácil</Text>
      <Text style={styles.subtitle}>Seleccione su rol:</Text>
      <TouchableOpacity style={styles.button} onPress={() => setUserRole("admin")}>
        <Text style={styles.buttonText}>Administrador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setUserRole("collector")}>
        <Text style={styles.buttonText}>Cobrador</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0891b2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default RoleSelectionScreen

