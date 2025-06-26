import { Api, ApiListResponse } from './base/api';
import { API_URL } from '../utils/constants';
import { IProduct, ICatalog } from '../types';

export class Catalog implements ICatalog {
    private api: Api;
    private container: HTMLElement;

    constructor(containerSelector: string) {
        this.api = new Api(API_URL);
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error('Container element not found');
        }
        this.container = container as HTMLElement;
    }

    async loadProducts(adress: string = '/product') {
        try {
            const response = await this.api.get(adress) as ApiListResponse<IProduct>;
        } catch (error) {
            this.container.innerHTML = '<p>Ошибка загрузки продуктов</p>';
        }
    }

    renderProducts(products: IProduct[]) {

    }
}
