"use client";

import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  const handleNavigate = () => {
    router.push(user ? "/dashboard" : "/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0d0f31] via-[#1b1f5e] to-[#2e3179] text-white flex items-center justify-center px-4">
      <motion.div
        className="max-w-4xl w-full rounded-2xl shadow-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 md:p-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img src="/images/treecampus-logo.png" alt="TreeCampus Logo" className="h-20 md:h-28 w-auto rounded-lg shadow-lg" />

        </motion.div>

        <motion.h1
          className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Unlock English Mastery with <span className="text-purple-400">AI-Powered Tutoring</span>
        </motion.h1>

        <motion.p
          className="text-md md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          TreeCampus AI Tutor is your smart, voice-enabled English learning assistant.
          Ask grammar, vocabulary, pronunciation, or comprehension doubts via text or voice —
          get clear answers instantly, just like from a real teacher. Learn anytime, 24/7.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {user && user.emailVerified ? (
            <button
              onClick={handleNavigate}
              className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="bg-white text-blue-800 hover:bg-gray-100 transition-all duration-300 px-6 py-3 rounded-lg font-semibold text-lg shadow-lg"
              >
                Sign Up Free
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
}
