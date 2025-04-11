'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Loader2, CircleUser, Eye, EyeOff } from 'lucide-react';

const maskCpf = (cpf: string | null | undefined): string => {
  if (!cpf) return 'Não informado';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `***.***.***${cleaned.substring(9,9)}-${cleaned.substring(9)}`;
  }
  return '***.***.***-**';
};

const maskPhone = (phone: string | null | undefined): string => {
  if (!phone) return 'Não informado';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10) {
    const lastFour = cleaned.slice(-4);
    if (cleaned.length === 11) {
       return `(**) *****-${lastFour}`;
    } else if (cleaned.length === 10) {
       return `(**) ****-${lastFour}`;
    }
  }
  return '(**) *****-****';
};

const maskAddress = (address: string | null | undefined): string => {
  if (!address || address.trim() === '') return 'Não informado';
  return '********************';
};


function ProfilePictureUpload() {
    const { user, updateUserProfilePicture } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (!allowedTypes.includes(file.type)) {
                setUploadError("Tipo de arquivo inválido. Use PNG, JPG ou WEBP.");
                setSelectedFile(null);
                event.target.value = '';
                return;
            }
            if (file.size > maxSize) {
                setUploadError("Arquivo muito grande (máximo 2MB).");
                setSelectedFile(null);
                event.target.value = '';
                return;
            }

            setSelectedFile(file);
            setUploadError(null);
        } else {
             setSelectedFile(null);
        }
     };

    const handleUpload = async () => {
        if (!selectedFile || !user) {
            setUploadError("Selecione um arquivo primeiro.");
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        let fileIdentifier: string | null = null;
        console.log("Iniciando upload para usuário ID:", user.id);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            console.log("Enviando para media-service...");
            const mediaResponse = await fetch('http://localhost:8084/api/media/upload/profile-picture', {
                 method: 'POST',
                 body: formData,
                 // TODO: Adicionar Header de Autenticação se necessário
            });
            console.log("Resposta media-service:", mediaResponse.status);
    
            if (!mediaResponse.ok) {
                 const errorText = await mediaResponse.text();
                 throw new Error(`Falha no upload (Media Service): ${errorText || mediaResponse.status}`);
            }
    
            const result = await mediaResponse.json();
            fileIdentifier = result?.fileName || result?.relativeUrl;
    
            if (!fileIdentifier) {
                 throw new Error("Identificador do arquivo não retornado pelo serviço de mídia.");
            }
            console.log("Arquivo enviado, identificador:", fileIdentifier);
    
            console.log("Enviando identificador para user-service...");
            const userUpdateResponse = await fetch(`http://localhost:8083/api/users/${user.id}/profile-image-url`, { // <<< URL DO USER SERVICE
                method: 'PATCH', // Ou PUT
                headers: {
                    'Content-Type': 'application/json',
                    // TODO: Adicionar Header de Autenticação
                },
                // Envia um JSON simples com a informação retornada pelo media-service
                body: JSON.stringify({ imageUrl: fileIdentifier }) // Envia o nome/url relativa
            });
             console.log("Resposta user-service:", userUpdateResponse.status);
    
            if (!userUpdateResponse.ok) {
                 const errorText = await userUpdateResponse.text();
                 throw new Error(`Falha ao salvar URL no perfil (User Service): ${errorText || userUpdateResponse.status}`);
            }
    
             // Se chegou aqui, ambas as chamadas deram certo!
             // --- ETAPA 3: Atualizar o Estado Local ---
             // Constrói a URL completa para exibição (ajuste se necessário)
             // Se o media-service retornar uma URL absoluta, use-a diretamente.
             // Se retornar só o nome, você precisa saber a URL base para servir as imagens.
             // Assumindo que /media/profile-pictures/{filename} será a URL para ver a imagem:
             const fullImageUrl = `http://localhost:8084/api/media/profile-pictures/${fileIdentifier}`; // <<< Exemplo! Ajuste conforme sua URL de servir arquivos
    
             updateUserProfilePicture(fullImageUrl); // Atualiza o contexto
             setSelectedFile(null);
             const fileInput = document.getElementById('picture') as HTMLInputElement;
             if(fileInput) fileInput.value = '';
             alert('Foto de perfil atualizada com sucesso!');
    
    
        } catch (error: any) {
             console.error("Erro durante o processo de upload:", error);
             setUploadError(error.message || 'Erro desconhecido durante o upload.');
        } finally {
            setIsUploading(false);
        }
    };
    

    return (
        <div className="space-y-4 border p-4 rounded-md bg-slate-50">
            <h3 className="text-lg font-medium">Alterar Foto de Perfil</h3>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                 <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border shrink-0">
                     {user?.profileImageUrl ? (
                         <Image
                             key={user.profileImageUrl}
                             src={user.profileImageUrl}
                             alt="Foto de Perfil Atual"
                             width={80}
                             height={80}
                             className="object-cover w-full h-full"
                             onError={(e) => { (e.target as HTMLImageElement).style.display = 'none';}}
                         />
                     ) : (
                         <CircleUser className="h-10 w-10 text-gray-500" />
                     )}
                 </div>
                 <div className='flex-grow space-y-2 w-full'>
                    <Label htmlFor="picture">Selecionar nova foto (PNG, JPG, WEBP - max 2MB)</Label>
                    <Input id="picture" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} disabled={isUploading} className="text-sm"/>
                    {selectedFile && <p className="text-xs text-muted-foreground pt-1">Selecionado: {selectedFile.name}</p>}
                    <Button onClick={handleUpload} disabled={!selectedFile || isUploading} size="sm">
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Salvar Nova Foto'}
                    </Button>
                 </div>
            </div>
            {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
        </div>
    )
}

export default function PerfilPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [isCpfMasked, setIsCpfMasked] = useState(true);
  const [isCelularMasked, setIsCelularMasked] = useState(true);
  const [isEnderecoMasked, setIsEnderecoMasked] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600"/>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <Card className="max-w-3xl mx-auto shadow-lg">

         <CardHeader className="bg-gray-50 rounded-t-lg">
            <CardTitle className="text-2xl">Meu Perfil</CardTitle>
            <CardDescription>Gerencie suas informações e preferências.</CardDescription>
         </CardHeader>

         <CardContent className="space-y-8 p-6">

            <ProfilePictureUpload />

            <div className="border p-4 rounded-md space-y-3">
                 <h3 className="text-lg font-medium mb-3 border-b pb-2">Informações Pessoais</h3>

                 <div className="flex items-center">
                     <strong className="font-semibold w-24 inline-block shrink-0">Nome:</strong>
                     <span>{user.nome}</span>
                 </div>
                 <div className="flex items-center">
                     <strong className="font-semibold w-24 inline-block shrink-0">Email:</strong>
                     <span>{user.email}</span>
                 </div>

                 <div className="flex items-center space-x-2">
                     <p className="flex-grow min-w-0">
                         <strong className="font-semibold w-24 inline-block shrink-0">CPF:</strong>
                         <span className="font-mono text-sm">
                             {isCpfMasked ? maskCpf(user.cpf) : user.cpf}
                         </span>
                     </p>
                     <Button aria-label={isCpfMasked ? 'Mostrar CPF' : 'Ocultar CPF'} variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setIsCpfMasked(!isCpfMasked)}>
                         {isCpfMasked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                     </Button>
                 </div>

                 <div className="flex items-center space-x-2">
                     <p className="flex-grow min-w-0">
                         <strong className="font-semibold w-24 inline-block shrink-0">Celular:</strong>
                         <span className="font-mono text-sm">
                             {isCelularMasked ? maskPhone(user.celular) : (user.celular || 'Não informado')}
                         </span>
                     </p>
                     <Button aria-label={isCelularMasked ? 'Mostrar Celular' : 'Ocultar Celular'} variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setIsCelularMasked(!isCelularMasked)}>
                         {isCelularMasked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                     </Button>
                 </div>

                   <div className="flex items-center space-x-2">
                     <p className="flex-grow min-w-0">
                         <strong className="font-semibold w-24 inline-block shrink-0">Endereço:</strong>
                         <span className="font-mono text-sm break-words">
                            {isEnderecoMasked ? maskAddress(user.endereco) : (user.endereco || 'Não informado')}
                         </span>
                     </p>
                     <Button aria-label={isEnderecoMasked ? 'Mostrar Endereço' : 'Ocultar Endereço'} variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setIsEnderecoMasked(!isEnderecoMasked)}>
                         {isEnderecoMasked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                     </Button>
                 </div>
            </div>            

            <div className="border p-4 rounded-md bg-slate-50">
                 <h3 className="text-lg font-medium mb-3">Alterar Email</h3>
                 <p className='text-sm text-muted-foreground mb-3'>
                     Para alterar seu email, utilize o formulário apropriado (ainda a ser implementado).
                     Você precisará fornecer seu novo email e sua senha atual.
                 </p>
                 {/* TODO: Adicionar Botão/Link que leva para o formulário/modal de alterar email */}
                 {/* Exemplo: <Button variant="link" asChild><Link href="/perfil/alterar-email">Alterar email</Link></Button> */}
             </div>

             <div className="border p-4 rounded-md bg-slate-50">
                 <h3 className="text-lg font-medium mb-3">Alterar Senha</h3>
                 <p className='text-sm text-muted-foreground mb-3'>
                     Para alterar sua senha, utilize o formulário apropriado (ainda a ser implementado).
                     Você precisará fornecer sua senha atual e a nova senha desejada.
                 </p>
                 {/* TODO: Adicionar Botão/Link que leva para o formulário/modal de alterar senha */}
                 {/* Exemplo: <Button variant="link" asChild><Link href="/perfil/alterar-senha">Alterar minha senha</Link></Button> */}
             </div>

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
