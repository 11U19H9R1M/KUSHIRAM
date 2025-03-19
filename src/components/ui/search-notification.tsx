
import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function SearchNotification() {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  return (
    <Alert variant="destructive" className="mb-4 glass-morphism">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Search Service Unavailable</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>Due to technical issues, the search service is temporarily unavailable.</span>
        <button 
          onClick={() => setIsVisible(false)} 
          className="text-xs underline"
        >
          Dismiss
        </button>
      </AlertDescription>
    </Alert>
  )
}
