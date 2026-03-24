import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a
          href="/"
          className="text-xl font-bold text-purple-600 dark:text-purple-400 no-underline"
        >
          Timeline
        </a>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/api/auth/google"
              className="text-sm px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors no-underline"
            >
              Sign in with Google
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
