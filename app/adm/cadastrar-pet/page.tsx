"use client";

import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function CadastrarPetPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    especie: "CACHORRO",
    raca: "",
    idade: 0,
    genero: "MACHO",
    porte: "MEDIO",
    descricao: "",
    cidade: "",
    estado: "",
    mediaIdentifier: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.cargo !== "admin")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8080/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao cadastrar pet.");
      }

      alert("Pet cadastrado com sucesso!");
      setForm({
        nome: "",
        especie: "CACHORRO",
        raca: "",
        idade: 0,
        genero: "MACHO",
        porte: "MEDIO",
        descricao: "",
        cidade: "",
        estado: "",
        mediaIdentifier: "",
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) return <p className="p-4">Carregando...</p>;

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Pet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input name="nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="especie">Espécie</Label>
            <select name="especie" value={form.especie} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="CACHORRO">Cachorro</option>
              <option value="GATO">Gato</option>
            </select>
          </div>
          <div>
            <Label htmlFor="raca">Raça</Label>
            <Input name="raca" value={form.raca} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="idade">Idade</Label>
            <Input name="idade" type="number" value={form.idade} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="genero">Gênero</Label>
            <select name="genero" value={form.genero} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="MACHO">Macho</option>
              <option value="FEMEA">Fêmea</option>
            </select>
          </div>
          <div>
            <Label htmlFor="porte">Porte</Label>
            <select name="porte" value={form.porte} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="PEQUENO">Pequeno</option>
              <option value="MEDIO">Médio</option>
              <option value="GRANDE">Grande</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={4} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input name="cidade" value={form.cidade} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="estado">Estado (UF)</Label>
            <Input name="estado" value={form.estado} onChange={handleChange} maxLength={2} required />
          </div>
        </div>

        <div>
          <Label htmlFor="mediaIdentifier">Identificador da Imagem (ex: 1.webp)</Label>
          <Input name="mediaIdentifier" value={form.mediaIdentifier} onChange={handleChange} />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar Pet"}
        </Button>
      </form>
    </main>
  );
}
