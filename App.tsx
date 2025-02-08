import React, { useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import RoleSelectionScreen from "./screens/RoleSelectionScreen"
import AdminDashboard from "./screens/AdminDashboard"
import CollectorApp from "./screens/CollectorApp"

const Stack = createStackNavigator()

export default function App() {
  const [userRole, setUserRole] = useState<"admin" | "collector" | null>(null)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!userRole ? (
          <Stack.Screen name="RoleSelection">
            {(props) => <RoleSelectionScreen {...props} setUserRole={setUserRole} />}
          </Stack.Screen>
        ) : userRole === "admin" ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="CollectorApp" component={CollectorApp} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

