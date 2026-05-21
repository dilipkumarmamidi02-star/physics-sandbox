import {
  Link
} from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 px-8 py-5 flex justify-between items-center">

      <Link
        to="/"
        className="text-3xl font-black text-cyan-400"
      >
        PHX
      </Link>

      <div className="flex gap-6 text-lg">

        <Link
          to="/"
          className="hover:text-cyan-400"
        >
          Quiz
        </Link>

        <Link
          to="/dashboard"
          className="hover:text-cyan-400"
        >
          Dashboard
        </Link>

      </div>

    </nav>
  )
}
