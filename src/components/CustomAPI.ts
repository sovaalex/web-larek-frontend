import { IOrder, IProduct, ISuccess } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface ICustomAPI {
    getProductList: () => Promise<IProduct[]>;
    orderResult: (order: IOrder) => Promise<ISuccess>;
}

export class CustomAPI extends Api implements ICustomAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string) {
        super(baseUrl);
        this.cdn = cdn;
    }

    getProductList(): Promise<IProduct[]> {
        return this.get(`/product`)
        .then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }

    orderResult(order: IOrder): Promise<ISuccess> {
        return this.post(`/order`, order)
        .then((data: ISuccess) => data);
    }
}
