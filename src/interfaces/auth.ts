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
    students: string[];
    class: string;
    subject: string;
    work: string;
    attachment: DOCUMENTS[];
    assignedOn: string;

}
