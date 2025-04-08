'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { registerUser } from '@/src/services/authService';

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [celular, setCelular] = useState('');
  const [endereco, setEndereco] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (senha !== confirmSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    // Assumindo login = email e cargo = user
    const userData = {
      nome,
      cpf,
      celular,
      endereco,
      login: email,
      senha,
      email,
      cargo: 'user',
    };

    try {
      const createdUser = await registerUser(userData);
      console.log('Usuário criado (resposta do serviço):', createdUser);

      setSuccess("Cadastro realizado com sucesso! Redirecionando para login...");
      setNome(''); setEmail(''); setCpf(''); setCelular(''); setEndereco(''); setSenha(''); setConfirmSenha('');

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      console.error("Erro no cadastro (componente):", err);
      setError(err.message || "Ocorreu uma falha inesperada ao tentar cadastrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-xl">Cadastro</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Nome */}
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" placeholder="Seu nome completo" required value={nome} onChange={(e) => setNome(e.target.value)} disabled={isLoading}/>
            </div>
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
            </div>
            {/* CPF e Celular */}
             <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" required value={cpf} onChange={(e) => setCpf(e.target.value)} disabled={isLoading}/>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="celular">Celular</Label>
                    <Input id="celular" placeholder="(00) 90000-0000" required value={celular} onChange={(e) => setCelular(e.target.value)} disabled={isLoading}/>
                </div>
            </div>
            {/* Endereço */}
            <div className="grid gap-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" placeholder="Rua, Número, Bairro, Cidade - Estado" required value={endereco} onChange={(e) => setEndereco(e.target.value)} disabled={isLoading}/>
            </div>
            {/* Senha */}
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} disabled={isLoading}/>
            </div>
            {/* Confirmar Senha */}
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input id="confirm-password" type="password" required value={confirmSenha} onChange={(e) => setConfirmSenha(e.target.value)} disabled={isLoading}/>
            </div>

            {/* Alertas de Erro/Sucesso */}
            {error && (
                <Alert variant="destructive">
                <AlertTitle>Erro no Cadastro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
             {success && (
                <Alert variant="default" className="bg-green-100 border-green-300 text-green-800">
                <AlertTitle>Sucesso!</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Botão Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Criar conta'}
            </Button>
          </form>
          {/* Link para Login */}
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}