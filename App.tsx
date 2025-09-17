// App.tsx
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Corrige los imports de acuerdo a la estructura real
import { RoleSelectionScreen } from "./components/RoleSelectionScreen";
import { AdminDashboard } from "./components/AdminDashboard";
import { CollectorApp } from "./components/CollectorApp";  // este componente lo crearás a continuación

const Stack = createStackNavigator();

export default function App() {
  const [userRole, setUserRole] = useState<"admin" | "collector" | null>(null);

  return (
    // tu navegación aquí
  );
}
