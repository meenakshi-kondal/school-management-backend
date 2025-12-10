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

interface DOCUMENTS {
    name?: string;
    url?: string;
}

export interface ASSIGNMENT {
    assigned_to: string[];
    class: string;
    subject: string;
    work: string;
    attachment: DOCUMENTS[];
    assigned_on: string;
    assigned_by: string;
    assigned_type: string;

}
