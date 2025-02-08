import React, { useState } from "react"
import { MobileFrame } from "./MobileFrame"
import { RoleSelectionScreen } from "./RoleSelectionScreen"
import { AdminDashboard } from "./AdminDashboard"

export function PagaFacilAppPreview() {
  const [currentScreen, setCurrentScreen] = useState<"roleSelection" | "adminDashboard" | "collectorApp">(
    "roleSelection",
  )

  const handleRoleSelection = (role: "admin" | "collector") => {
    if (role === "admin") {
      setCurrentScreen("adminDashboard")
    } else {
      setCurrentScreen("collectorApp")
    }
  }

  return (
    <MobileFrame>
      {currentScreen === "roleSelection" && <RoleSelectionScreen onSelectRole={handleRoleSelection} />}
      {currentScreen === "adminDashboard" && <AdminDashboard />}
      {currentScreen === "collectorApp" && <div className="p-4">Aplicación del Cobrador (En desarrollo)</div>}
    </MobileFrame>
  )
}

