'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Loader2 } from "lucide-react";
import { loginUser } from '@/services/authService';
import { useAuth } from '@/contexts/authContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    const credentials = { email, senha };

    try {
      const loggedInUser = await loginUser(credentials);
      console.log("Login bem-sucedido (resposta do serviço):", loggedInUser);

      login(loggedInUser);

      router.push('/');

    } catch (err: any) {
      console.error("Erro no login (componente):", err);
      setError(err.message || "Ocorreu uma falha inesperada ao tentar fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="mx-auto max-w-sm w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Digite seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
            </div>
            {/* Senha */}
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} disabled={isLoading} />
            </div>

            {/* Alerta de Erro */}
            {error && ( <Alert variant="destructive"> <AlertTitle>Erro no Login</AlertTitle> <AlertDescription>{error}</AlertDescription> </Alert> )}

            {/* Botão Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar'}
            </Button>
          </form>
           {/* Link para Cadastro */}
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "} <Link href="/cadastro" className="underline"> Cadastre-se </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
