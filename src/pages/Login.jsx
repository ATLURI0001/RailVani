import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, LogIn, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const next = searchParams.get("next") || "/railway/add-train";
  const { session, isAdmin, signInWithPassword, error: authError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session && isAdmin) {
      navigate(decodeURIComponent(next), { replace: true });
    }
  }, [session, isAdmin, next, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithPassword(email, password);
      navigate(decodeURIComponent(next), { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-slate-100 font-sans pb-20 relative flex flex-col justify-between"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.50) 0%, rgba(2, 6, 23, 0.65) 50%, rgba(2, 6, 23, 0.85) 100%), url("/images/railway-platform-bg.jpg")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}
    >
      <div>
        <Header />
        <main className="max-w-md mx-auto p-4 sm:p-6 mt-8">
          <div className="rounded-3xl bg-neutral-950/95 backdrop-blur-2xl border-4 border-amber-500/80 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] font-mono">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3.5 bg-amber-500/20 text-amber-400 border-2 border-amber-400 rounded-2xl mb-1 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-2xl font-black text-white tracking-wider uppercase">
                ADMIN CONSOLE ACCESS
              </h1>
              <p className="text-neutral-400 text-xs font-sans font-medium">
                Sign in with authorized administrator credentials to manage fleet trains, lines, and database templates.
              </p>
            </div>

            {(error || authError) && (
              <div className="p-3.5 bg-red-950/90 border-2 border-red-600 text-red-200 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                <span>{error || authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1" htmlFor="email">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter administrator email"
                  className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-white text-xs font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1" htmlFor="password">
                  Admin Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-2.5 bg-black border-2 border-neutral-700 rounded-xl text-white text-xs font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>AUTHENTICATING…</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>AUTHORIZE & SIGN IN</span>
                  </>
                )}
              </button>
            </form>

            <div className="border-t-2 border-neutral-800 pt-4 text-center">
              <Link to="/" className="text-xs text-neutral-400 hover:text-amber-300 transition flex items-center justify-center gap-1">
                <ArrowLeft size={13} />
                <span>Return to Public Home</span>
              </Link>
            </div>

          </div>
        </main>
      </div>

      <footer className="border-t-2 border-neutral-800 bg-black/90 py-4 text-center text-xs font-mono text-neutral-500">
        RAILVANI ADMIN CONSOLE • SECURITY LEVEL 1
      </footer>
    </div>
  );
}