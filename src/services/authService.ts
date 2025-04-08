const API_BASE_URL = 'http://localhost:8083/api/users';

interface CadastroData {
    nome: string;
    cpf: string;
    celular: string;
    endereco: string;
    login: string;
    senha: string;
    email: string;
    cargo: string;
}

interface LoginCredentials {
    email: string;
    senha: string;
}

interface UserInfo {
    id: number;
    nome: string;
    cpf: string;
    celular: string;
    endereco: string;
    login: string;
    email: string;
    cargo: string;
}

/**
 * Registra um novo usuário.
 * @param userData Dados do usuário para cadastro.
 * @returns Promise com os dados do usuário criado (UserInfo).
 * @throws Error com a mensagem de erro do backend.
 */

export const registerUser = async (userData: CadastroData): Promise<UserInfo> => {
    const response = await fetch(`${API_BASE_URL}/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro ${response.status} ao registrar:`, errorText);
        throw new Error(errorText || `Erro ${response.status} ao tentar registrar.`);
    }

    return await response.json() as UserInfo;
};


/**
 * Autentica um usuário.
 * @param credentials Credenciais (email, senha).
 * @returns Promise com os dados do usuário autenticado (UserInfo).
 * @throws Error com a mensagem de erro do backend.
 */
export const loginUser = async (credentials: LoginCredentials): Promise<UserInfo> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorText = await response.text();
         console.error(`Erro ${response.status} ao fazer login:`, errorText);
        throw new Error(errorText || `Erro ${response.status} ao tentar fazer login.`);
    }

    return await response.json() as UserInfo;
};
