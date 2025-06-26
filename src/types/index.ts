export interface IProduct {
    id: string;
    title: string;
    category?: string;
    description?: string;
    price: number;
    image: string;
}

export interface IBasketItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface IOrderData {
    address: string;
    paymentMethod: string;
    contacts: IContactData;
}

export interface IContactData {
    email: string;
    phone: string;
}

export interface ICatalog {
    loadProducts(adress?: string): Promise<void>;
    renderProducts(products: IProduct[]): void;
}

export interface IOrder {
    start(): void;
    close(): void;
}

export interface IModalOptions {
    templateId: string;
    data: Record<string, any>;
}
