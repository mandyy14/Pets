import { Button } from "@/components/ui/button";
import { PawPrint, Search } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8 text-blue-600" />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/" className="text-blue-600 font-medium">
                  Home
                </Link>
                <Link
                  href="/quero-adotar"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Quero adotar
                </Link>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900">
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
            <Button variant="ghost">Dwight</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
