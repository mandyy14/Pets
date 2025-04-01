import { Button } from "@/components/ui/button";
import { PawPrint, Search } from "lucide-react";
import Link from "next/link";

export default function QueroAdotar() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <PawPrint className="h-8 w-8 text-blue-600" />
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Home
                  </Link>
                  <Link
                    href="/quero-adotar"
                    className="text-blue-600 font-medium"
                  >
                    Quero adotar
                  </Link>
                  <Link
                    href="/faq"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    FAQ
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquise algo aqui..."
                  className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Button className="bg-blue-600 text-white">Clique aqui</Button>
              <Button variant="ghost">Amanda</Button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quero Adotar</h1>
        <div className="bg-amber-50 rounded-lg p-6">
          <p className="text-lg text-amber-800">
            Esta página está em construção. Em breve você poderá encontrar aqui
            todos os pets disponíveis para adoção.
          </p>
        </div>
      </div>
    </main>
  );
}
