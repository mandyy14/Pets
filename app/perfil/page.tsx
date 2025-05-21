"use client";

import { CircleUser, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../src/contexts/authContext";

const maskCpf = (cpf: string | null | undefined): string => {
  if (!cpf) return "Não informado";
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `***.***.${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
  }
  return "***.***.***-**";
};
const maskPhone = (phone: string | null | undefined): string => {
  if (!phone) return "Não informado";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length >= 10) {
    const lastFour = cleaned.slice(-4);
    if (cleaned.length === 11) {
      return `(**) 9****-${lastFour}`;
    } else if (cleaned.length === 10) {
      return `(**) ****-${lastFour}`;
    }
  }
  return "(**) *****-****";
};
const maskAddress = (address: string | null | undefined): string => {
  if (!address || address.trim() === "") return "Não informado";
  return "********************";
};

function ProfilePictureUpload() {
  const { user, refreshProfilePicVersion } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (!allowedTypes.includes(file.type)) {
        /* ... setUploadError ... */ return;
      }
      if (file.size > maxSize) {
        /* ... setUploadError ... */ return;
      }
      setSelectedFile(file);
      setUploadError(null);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      setUploadError("Selecione um arquivo e esteja logado.");
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    console.log("Upload: Iniciando para usuário ID:", user.id);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      console.log("Upload: Enviando para media-service...");
      const mediaResponse = await fetch(
        `http://localhost:8080/api/media/upload/profile-picture/${user.id}`,
        {
          method: "POST",
          body: formData,
          // TODO: Header Auth?
        }
      );
      console.log("Upload: Resposta media-service:", mediaResponse.status);
      if (!mediaResponse.ok) {
        const errorText = await mediaResponse.text();
        throw new Error(
          `Falha no upload (Media Service): ${errorText || mediaResponse.status
          }`
        );
      }
      const result = await mediaResponse.json();
      console.log("Upload: Sucesso media-service, resposta:", result);

      console.log("Upload: Sinalizando refreshProfilePicVersion");
      refreshProfilePicVersion();

      setSelectedFile(null);
      const fileInput = document.getElementById("picture") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      alert("Foto de perfil enviada! A atualização pode levar um momento.");
    } catch (error: any) {
      console.error("Upload: Erro durante o processo:", error);
      setUploadError(error.message || "Erro desconhecido durante o upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isCurrentImgLoading, setIsCurrentImgLoading] = useState(false);
  const { profilePicVersion } = useAuth();

  useEffect(() => {
    if (user?.id) {
      setIsCurrentImgLoading(true);
      console.log(
        `UploadComp: Buscando foto para user ${user.id} (v${profilePicVersion})`
      );
      fetch(`http://localhost:8080/api/users/${user.id}/profile-picture-url`)
        .then((res) =>
          res.ok ? res.json() : Promise.resolve({ imageUrl: null })
        )
        .then((data) => setCurrentImageUrl(data.imageUrl || null))
        .catch(() => setCurrentImageUrl(null))
        .finally(() => setIsCurrentImgLoading(false));
    } else {
      setCurrentImageUrl(null);
    }
  }, [user?.id, profilePicVersion]);

  return (
    <div className="space-y-4 border p-4 rounded-md bg-slate-50">
      <h3 className="text-lg font-medium">Alterar Foto de Perfil</h3>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Foto Atual */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border shrink-0">
          {isCurrentImgLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          ) : currentImageUrl ? (
            <Image
              key={currentImageUrl}
              src={currentImageUrl}
              alt="Foto de Perfil Atual"
              width={80}
              height={80}
              className="object-cover w-full h-full"
              onError={(e) => {
                console.error("Erro ao carregar imagem:", currentImageUrl);
                setCurrentImageUrl(null);
              }}
            />
          ) : (
            <CircleUser className="h-10 w-10 text-gray-500" />
          )}
        </div>
        {/* Input e Botão */}
        <div className="flex-grow space-y-2 w-full">
          <Label htmlFor="picture">
            Selecionar nova foto (PNG, JPG, WEBP - max 2MB)
          </Label>
          <Input
            id="picture"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="text-sm"
          />
          {selectedFile && (
            <p className="text-xs text-muted-foreground pt-1">
              Selecionado: {selectedFile.name}
            </p>
          )}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            size="sm"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Salvar Nova Foto"
            )}
          </Button>
        </div>
      </div>
      {/* Mensagem de Erro */}
      {uploadError && (
        <p className="text-sm text-red-600 mt-2">{uploadError}</p>
      )}
    </div>
  );
}

export default function PerfilPage() {
  const { user, isLoading, profilePicVersion } = useAuth();
  const router = useRouter();

  const [isCpfMasked, setIsCpfMasked] = useState(true);
  const [isCelularMasked, setIsCelularMasked] = useState(true);
  const [isEnderecoMasked, setIsEnderecoMasked] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="bg-gray-50 rounded-t-lg">
          <CardTitle className="text-2xl">Meu Perfil</CardTitle>
          <CardDescription>
            Gerencie suas informações e preferências.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <ProfilePictureUpload />

          {/* Seção de Informações Pessoais */}
          <div className="border p-4 rounded-md space-y-3">
            <h3 className="text-lg font-medium mb-3 border-b pb-2">
              Informações Pessoais
            </h3>
            {/* Nome, Email (sem máscara) */}
            <div className="flex items-center">
              <strong className="font-semibold w-24 inline-block shrink-0">
                Nome:
              </strong>
              <span>{user.nome}</span>
            </div>
            <div className="flex items-center">
              <strong className="font-semibold w-24 inline-block shrink-0">
                Email:
              </strong>
              <span>{user.email}</span>
            </div>
            {/* CPF (com máscara/botão) */}
            <div className="flex items-center space-x-2">
              <p className="flex-grow min-w-0">
                <strong className="font-semibold w-24 inline-block shrink-0">
                  CPF:
                </strong>
                <span className="font-mono text-sm">
                  {isCpfMasked ? maskCpf(user.cpf) : user.cpf}
                </span>
              </p>
              <Button
                aria-label={isCpfMasked ? "Mostrar CPF" : "Ocultar CPF"}
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => setIsCpfMasked(!isCpfMasked)}
              >
                {isCpfMasked ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            {/* Celular (com máscara/botão) */}
            <div className="flex items-center space-x-2">
              <p className="flex-grow min-w-0">
                <strong className="font-semibold w-24 inline-block shrink-0">
                  Celular:
                </strong>
                <span className="font-mono text-sm">
                  {isCelularMasked
                    ? maskPhone(user.celular)
                    : user.celular || "Não informado"}
                </span>
              </p>
              <Button
                aria-label={
                  isCelularMasked ? "Mostrar Celular" : "Ocultar Celular"
                }
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => setIsCelularMasked(!isCelularMasked)}
              >
                {isCelularMasked ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            {/* Endereço (com máscara/botão) */}
            <div className="flex items-center space-x-2">
              <p className="flex-grow min-w-0">
                <strong className="font-semibold w-24 inline-block shrink-0">
                  Endereço:
                </strong>
                <span className="font-mono text-sm break-words">
                  {isEnderecoMasked
                    ? maskAddress(user.endereco)
                    : user.endereco || "Não informado"}
                </span>
              </p>
              <Button
                aria-label={
                  isEnderecoMasked ? "Mostrar Endereço" : "Ocultar Endereço"
                }
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => setIsEnderecoMasked(!isEnderecoMasked)}
              >
                {isEnderecoMasked ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Placeholder Alterar Email */}
          <div className="border p-4 rounded-md bg-slate-50">
            <h3 className="text-lg font-medium mb-3">Alterar Email</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Implementar formulário/botão aqui para chamar o endpoint PATCH
              /api/users/{user.id}/email.
            </p>
          </div>

          {/* Placeholder Alterar Senha */}
          <div className="border p-4 rounded-md bg-slate-50">
            <h3 className="text-lg font-medium mb-3">Alterar Senha</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Implementar formulário/botão aqui para chamar o endpoint PATCH
              /api/users/{user.id}/password.
            </p>
          </div>

          {/* Botão Voltar */}
          <div className="border-t pt-6 flex justify-center">
            <Link href="/">
              <Button variant="outline">Voltar para Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
