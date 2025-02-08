import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Home, Users, DollarSign, Map } from "react-native-feather"
import HomeScreen from "./admin/HomeScreen"
import RoutesScreen from "./admin/RoutesScreen"
import LoansScreen from "./admin/LoansScreen"
import CollectorsScreen from "./admin/CollectorsScreen"

const Tab = createBottomTabNavigator()

const AdminDashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon

          if (route.name === "Inicio") {
            icon = <Home stroke={color} width={size} height={size} />
          } else if (route.name === "Rutas") {
            icon = <Map stroke={color} width={size} height={size} />
          } else if (route.name === "Préstamos") {
            icon = <DollarSign stroke={color} width={size} height={size} />
          } else if (route.name === "Cobradores") {
            icon = <Users stroke={color} width={size} height={size} />
          }

          return icon
        },
      })}
      tabBarOptions={{
        activeTintColor: "#0891b2",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Rutas" component={RoutesScreen} />
      <Tab.Screen name="Préstamos" component={LoansScreen} />
      <Tab.Screen name="Cobradores" component={CollectorsScreen} />
    </Tab.Navigator>
  )
}

export default AdminDashboard

