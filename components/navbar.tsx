"use client";

import { useAuth } from "@/contexts/authContext";
import {
  CircleUser,
  Loader2,
  LogOut,
  PawPrint,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout, isLoading, profilePicVersion } = useAuth();
  const [navbarPicUrl, setNavbarPicUrl] = useState<string | null>(null);
  const [isPicLoading, setIsPicLoading] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (user?.id && !isLoading) {
      setIsPicLoading(true);
      console.log(
        `Navbar: Buscando URL da foto para user ${user.id} (versão ${profilePicVersion})`
      );
      fetch(`http://localhost:8080/api/users/${user.id}/profile-picture-url`)
        .then((res) => {
          if (res.ok) return res.json();
          if (res.status !== 404)
            console.error(`Navbar: Erro ${res.status} ao buscar URL da foto.`);
          return Promise.resolve({ imageUrl: null });
        })
        .then((data) => {
          console.log(`Navbar: URL recebida: ${data?.imageUrl}`);
          setNavbarPicUrl(data?.imageUrl || null);
        })
        .catch((error) => {
          console.error("Navbar: Erro de fetch ao buscar URL da foto", error);
          setNavbarPicUrl(null);
        })
        .finally(() => setIsPicLoading(false));
    } else if (!user) {
      setNavbarPicUrl(null);
      setIsPicLoading(false);
    }
  }, [user?.id, profilePicVersion, isLoading]);

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Links */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8 text-amber-600" />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {" "}
                  Home{" "}
                </Link>
                <Link
                  href="/quero-adotar"
                  className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {" "}
                  Quero adotar{" "}
                </Link>
                <Link
                  href="/faq"
                  className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {" "}
                  FAQ{" "}
                </Link>
              </div>
            </div>
          </div>

          {/* Busca e Menu Usuário */}
          <div className="flex items-center space-x-4">
            {/* Busca */}
            {/* <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div> */}

            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9 overflow-hidden border"
                  disabled={isLoading}
                >
                  {isLoading || isPicLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : navbarPicUrl ? (
                    <Image
                      key={navbarPicUrl}
                      src={navbarPicUrl}
                      alt="Foto de Perfil"
                      width={36}
                      height={36}
                      className="object-cover rounded-full"
                      onError={(e) => {
                        console.error(
                          "Navbar: Erro ao carregar imagem",
                          navbarPicUrl
                        );
                        setNavbarPicUrl(null);
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <CircleUser className="h-5 w-5 text-gray-600" />
                  )}
                  <span className="sr-only">Abrir menu do usuário</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      Olá, {user.nome ? user.nome.split(" ")[0] : "Usuário"}!
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center"
                      onClick={() => router.push("/perfil")}
                    >
                      <UserIcon className="mr-2 h-4 w-4" /> Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 flex items-center"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sair
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Acesso</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push("/login")}
                    >
                      Fazer login
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push("/cadastro")}
                    >
                      Cadastrar
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
