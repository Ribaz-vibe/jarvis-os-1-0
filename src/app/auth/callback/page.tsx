"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Verificando autenticação...");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth error:", error);
          setStatus("Erro na autenticação. Redirecionando...");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        if (session) {
          setStatus("Login realizado com sucesso!");
          // Salvar info do usuário
          localStorage.setItem('jarvis_user_id', session.user.id);
          localStorage.removeItem('jarvis_guest_mode');
          
          setTimeout(() => router.push("/"), 1000);
        } else {
          // Tentar verificar a URL hash do OAuth
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (!sessionError) {
              setStatus("Login realizado com sucesso!");
              setTimeout(() => router.push("/"), 1000);
              return;
            }
          }

          setStatus("Sessão não encontrada. Redirecionando...");
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("Erro ao processar autenticação.");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center"
        >
          <Bot className="text-white" size={32} />
        </motion.div>
        <p className="text-slate-400 text-lg">{status}</p>
      </motion.div>
    </div>
  );
}