"use client";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ImageDog from "../app/assets/dog.webp";
import { Pet } from "../app/types/Pet.type";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

interface Filters {
  nome: string;
  especie: string;
  idadeMin: string;
  idadeMax: string;
}

function Favoritos() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    nome: "",
    especie: "",
    idadeMin: "",
    idadeMax: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.nome) params.append("nome", filters.nome);
      if (filters.especie) params.append("especie", filters.especie);
      if (filters.idadeMin) params.append("idadeMin", filters.idadeMin);
      if (filters.idadeMax) params.append("idadeMax", filters.idadeMax);
      params.append("size", "4");

      const res = await fetch(
        `http://localhost:8082/api/pets/disponiveis?${params.toString()}`
      );
      const page = await res.json();
      setPets(page.content || []);
    } catch (err) {
      console.error("Erro ao buscar pets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">Favoritos</li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Descritivo */}
        <div className="bg-amber-50 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-semibold text-amber-800 mb-4">
            Meus favoritos
          </h1>
          <p className="text-amber-700">
            Reúna aqui todos os pets que conquistaram o seu coração de um jeito
            especial. Quer seguir com a adoção de algum deles?
            <br />
            Clique em S2 para preencher o formulário de interesse.
          </p>
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold mb-6">Pets favoritados</h2>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            name="nome"
            value={filters.nome}
            onChange={handleChange}
            placeholder="Nome"
            className="border rounded px-2 py-1"
          />
          <select
            name="especie"
            value={filters.especie}
            onChange={handleChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Todas as espécies</option>
            <option value="CACHORRO">Cachorro</option>
            <option value="GATO">Gato</option>
          </select>
          <input
            type="number"
            name="idadeMin"
            value={filters.idadeMin}
            onChange={handleChange}
            placeholder="Idade mínima"
            className="border rounded px-2 py-1 w-32"
          />
          <input
            type="number"
            name="idadeMax"
            value={filters.idadeMax}
            onChange={handleChange}
            placeholder="Idade máxima"
            className="border rounded px-2 py-1 w-32"
          />
          <button
            onClick={fetchPets}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded"
          >
            Aplicar filtros
          </button>
        </div>

        {/* Lista de cards */}
        {loading ? (
          <p>Carregando pets...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={pet.imagemUrl || ImageDog}
                    alt={pet.nome}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
                <div className="p-4 bg-amber-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{pet.nome}</h3>
                    <span className="text-xs text-amber-700 uppercase">
                      {pet.proprietario}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{pet.endereco}</p>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    Quero adotar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
export default Favoritos;
