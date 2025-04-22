export interface Pet {
    id: number;
    nome: string;
    especie: string;
    endereco: string;
    proprietario: string; // ou “dono”, conforme seu DTO
    imagemUrl: string;    // ajustar conforme campo real
}