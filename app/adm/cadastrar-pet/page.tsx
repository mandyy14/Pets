"use client";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CadastrarPetPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.cargo !== "admin")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.cargo !== "admin") {
    return <p className="p-8">Verificando permissões...</p>;
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Pet</h1>
      {/* Formulário aqui */}
    </main>
  );
}
