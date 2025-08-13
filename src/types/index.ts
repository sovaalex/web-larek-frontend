export interface IProduct {
    id: string;
    title: string;
    price: number;
    category: string;
    image: string;
    description: string;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface ISuccess {
    id: string;
    total: number;
}
