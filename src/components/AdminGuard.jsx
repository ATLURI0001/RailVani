import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminGuard({ children }) {
  const { loading, session, isAdmin, email, signOut, loginAsDemoAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="loader rounded-full border-4 border-gray-200 h-10 w-10"></div>
      </div>
    );
  }

  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-xl shadow p-6 text-center space-y-4">
      <ShieldAlert className="mx-auto text-amber-500" size={36} />
      <h1 className="text-xl font-semibold text-gray-800">Admins only</h1>
      <p className="text-sm text-gray-600">
        {email || "This account"} is signed in but isn't an admin, so it can't open this page.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
        <button
          type="button"
          onClick={loginAsDemoAdmin}
          className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          Switch to Demo Admin
        </button>
        <button
          type="button"
          onClick={signOut}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
