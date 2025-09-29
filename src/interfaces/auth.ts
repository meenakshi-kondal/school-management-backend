export interface LOGIN {
    username?: string;
    password: string;
    email?: string;
    id?: string
}

export interface TOKEN {
    user_id: string;
    token: string;
}
