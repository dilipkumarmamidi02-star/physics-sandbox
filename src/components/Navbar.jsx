import { Link } from "react-router-dom"

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth"

import { auth } from "@/lib/firebase"

import { useAuth } from "@/lib/AuthContext"

export default function Navbar() {

  const authData = useAuth()

  const user = authData?.user

  async function login() {

    const provider =
      new GoogleAuthProvider()

    await signInWithPopup(
      auth,
      provider
    )

    window.location.reload()
  }

  async function logout() {

    await signOut(auth)

    window.location.reload()
  }

  return (

    <div className="bg-black text-white p-4 flex gap-6 items-center border-b border-zinc-800">

      <div className="text-2xl font-bold">
        PHX
      </div>

      <Link to="/dashboard">
        Dashboard
      </Link>

      <Link to="/quiz">
        Quiz
      </Link>

      <div className="ml-auto">

        {user ? (

          <div className="flex gap-4 items-center">

            <span className="text-sm">
              {user.email}
            </span>

            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>

          </div>

        ) : (

          <button
            onClick={login}
            className="bg-blue-600 px-4 py-1 rounded"
          >
            Login
          </button>

        )}

      </div>

    </div>
  )
}
