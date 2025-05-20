"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";

export default function CadastrarPetPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("CACHORRO");
  const [idade, setIdade] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.cargo !== "admin")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagem) {
      alert("Selecione uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("especie", especie);
    formData.append("idade", String(idade));
    formData.append("descricao", descricao);
    formData.append("file", imagem);

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:8080/api/pets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao cadastrar pet");
      }

      alert("Pet cadastrado com sucesso!");
      setNome("");
      setEspecie("CACHORRO");
      setIdade(0);
      setDescricao("");
      setImagem(null);
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao cadastrar o pet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Pet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setNome(e.target.value)
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="especie">Espécie</Label>
          <select
            id="especie"
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="CACHORRO">Cachorro</option>
            <option value="GATO">Gato</option>
          </select>
        </div>

        <div>
          <Label htmlFor="idade">Idade</Label>
          <Input
            id="idade"
            type="number"
            value={idade}
            onChange={(e: { target: { value: any } }) =>
              setIdade(Number(e.target.value))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="imagem">Imagem</Label>
          <Input
            id="imagem"
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                setImagem(e.target.files[0]);
              }
            }}
            required
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar Pet"}
        </Button>
      </form>
    </main>
  );
}
