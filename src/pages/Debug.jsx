import { useAuth } from "@/lib/AuthContext"

export default function Debug() {

  const { user } = useAuth()

  return (
    <pre style={{ padding: 20 }}>
      {JSON.stringify(user, null, 2)}
    </pre>
  )
}
