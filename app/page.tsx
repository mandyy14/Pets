import ImageDog from "../app/assets/dog.webp";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
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

        <h2 className="text-xl font-semibold mb-6">Pets favoritados</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={ImageDog}
                  alt="Cachorrinho"
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
                  <h3 className="text-lg font-semibold">Feijão</h3>
                  <span className="text-xs text-amber-700 uppercase">
                    AMANDA MESQUITA
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Rua teste, SAO PAULO, SP
                </p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  Quero adotar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
