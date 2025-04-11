'use client';

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { CircleUser, PawPrint, Search, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <nav className="border-b h-16 flex items-center justify-end px-8"><div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div></nav>;
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8 text-amber-600" />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/quero-adotar" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium">
                  Quero adotar
                </Link>
                <Link href="/faq" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium">
                  FAQ
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm" // Ajustado estilo
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9 overflow-hidden"
                >
                   {user && user.profileImageUrl ? (
                       <Image
                           src={user.profileImageUrl}
                           alt="Foto de Perfil"
                           width={36}
                           height={36}
                           className="object-cover rounded-full"
                           onError={(e) => { (e.target as HTMLImageElement).src = '/path/to/default/icon.png';}}
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
                    <DropdownMenuLabel>Olá, {user.nome.split(' ')[0]}!</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/perfil" className="flex items-center"> {}
                        <UserIcon className="mr-2 h-4 w-4" /> Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" onClick={handleLogout}>
                       <LogOut className="mr-2 h-4 w-4" /> Sair
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Acesso</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/login">Fazer login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/cadastro">Cadastrar</Link>
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
