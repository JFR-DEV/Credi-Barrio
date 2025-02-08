import type React from "react"

interface MobileFrameProps {
  children: React.ReactNode
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="mx-auto max-w-sm border-4 border-gray-900 rounded-[60px] overflow-hidden shadow-xl bg-white">
      <div className="relative">
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-900"></div>
        <div className="mx-4 mt-6 h-[600px] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

