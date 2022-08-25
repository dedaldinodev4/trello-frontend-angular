
export interface IUserCurrentDTO {
    id: string;
    token: string;
    username: string;
    email: string;
}

export interface IUserLoginRequestDTO {
    email?: string | null;
    password?: string | null;
}

export interface IUserRegisterRequestDTO {
    email?: string | null | undefined;
    username?: string | null | undefined;
    password?: string | null | undefined;
}