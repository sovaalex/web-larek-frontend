import { Api, ApiListResponse } from './base/api';
import { IOrder, ISuccess, IBaseItem } from '../types';

export class CustomAPI extends Api {
	readonly cdn: string;

	constructor(cdnUrl: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdnUrl;
	}

	getProductList(): Promise<IBaseItem[]> {
		return this.get('/product').then((data: ApiListResponse<IBaseItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderResult(order: IOrder): Promise<ISuccess> {
		return this.post(`/order`, order).then((data: ISuccess) => data);
	}
}
