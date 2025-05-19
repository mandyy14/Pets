"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Pet } from "../types/Pet.type";

function QueroAdotar() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filters, setFilters] = useState({
    nome: "",
    especie: "",
    idadeMin: "",
    idadeMax: "",
  });

  const fetchPets = async () => {
    const params = new URLSearchParams();
    if (filters.nome) params.append("nome", filters.nome);
    if (filters.especie) params.append("especie", filters.especie);
    if (filters.idadeMin) params.append("idadeMin", filters.idadeMin);
    if (filters.idadeMax) params.append("idadeMax", filters.idadeMax);

    const token = localStorage.getItem("token"); //Recupera o JWT do localStorage

    try {
      const res = await fetch(
        `http://localhost:8080/api/pets/disponiveis?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Erro na requisição:", err);
        setPets([]);
        return;
      }

      const page = await res.json();

      if (Array.isArray(page.content)) {
        setPets(page.content);
      } else {
        console.warn("Resposta inesperada da API:", page);
        setPets([]);
      }
    } catch (err) {
      console.error("Erro ao buscar pets:", err);
      setPets([]);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Pets disponíveis para adoção
        </h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            name="nome"
            placeholder="Nome"
            className="border rounded px-2 py-1"
            value={filters.nome}
            onChange={(e) => setFilters({ ...filters, nome: e.target.value })}
          />
          <select
            name="especie"
            className="border rounded px-2 py-1"
            value={filters.especie}
            onChange={(e) =>
              setFilters({ ...filters, especie: e.target.value })
            }
          >
            <option value="">Todas espécies</option>
            <option value="CACHORRO">Cachorro</option>
            <option value="GATO">Gato</option>
          </select>
          <input
            name="idadeMin"
            placeholder="Idade min"
            type="number"
            className="border rounded px-2 py-1 w-32"
            value={filters.idadeMin}
            onChange={(e) =>
              setFilters({ ...filters, idadeMin: e.target.value })
            }
          />
          <input
            name="idadeMax"
            placeholder="Idade máx"
            type="number"
            className="border rounded px-2 py-1 w-32"
            value={filters.idadeMax}
            onChange={(e) =>
              setFilters({ ...filters, idadeMax: e.target.value })
            }
          />
          <Button onClick={fetchPets}>Filtrar</Button>
        </div>

        {/* Lista de Pets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(pets) && pets.length > 0 ? (
            pets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden">
                <Image
                  src={`http://localhost:8080/api/media/serve/pet-pictures/${pet.mediaIdentifier}`}
                  alt={pet.nome}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-amber-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{pet.nome}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {pet.cidade} - {pet.estado}
                  </p>
                  {/*implementas infos restantes*/}
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    Quero Adotar
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              Nenhum pet encontrado.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default QueroAdotar;
