import { EventEmitter } from './base/events';
import {
	IBaseItem,
	IOrder,
	IOrderForm,
	IContactsForm,
	IBasketItem,
	ISuccess,
} from '../types';

export class AppDataModel extends EventEmitter {
	protected _products: IBaseItem[] = [];
	protected _basket: IBasketItem[] = [];
	protected _order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	protected _orderSuccess: ISuccess | null = null;
	protected _preview: string | null = null;

	constructor() {
		super();
	}

	set orderSuccess(orderResult: ISuccess) {
		this._orderSuccess = orderResult;
	}

	get orderSuccess(): ISuccess | null {
		return this._orderSuccess;
	}

	set products(products: IBaseItem[]) {
		this._products = products;
		this.emit('products:changed', this._products);
	}

	get products(): IBaseItem[] {
		return this._products;
	}

	getProduct(id: string): IBaseItem | undefined {
		return this._products.find((product) => product.id === id);
	}

	addToBasket(product: IBasketItem) {
		const existingItem = this._basket.find((item) => item.id === product.id);
		if (!existingItem) {
			this._basket.push({ ...product });
			this.emit('basket:changed', this._basket);
		}
	}

	removeFromBasket(id: string) {
		this._basket = this._basket.filter((item) => item.id !== id);
		this.emit('basket:changed', this._basket);
	}

	get basket(): IBasketItem[] {
		return this._basket;
	}

	get preparedBasketIds(): string[] {
		return this._basket.map(item => item.id);
	}

	get basketTotal(): number {
		return this._basket.reduce(
			(total, item) => total + (item.price || 0),
			0
		);
	}

	get basketCount(): number {
		return this._basket.length;
	}

	clearBasket() {
		this._basket = [];
		this.emit('basket:changed', this._basket);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this._order[field] = value;
		this.emit('order:changed', this._order);
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this._order[field] = value;
		this.emit('order:changed', this._order);
	}

	get order(): IOrder {
		return this._order;
	}

	set order(order: IOrder) {
		this._order = order;
		this.emit('order:changed', this._order);
	}

	validateOrder(): boolean {
		return !!(this._order.payment && this._order.address);
	}

	validateContacts(): boolean {
		return !!(this._order.email && this._order.phone);
	}

	resetOrder() {
		this._order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
		this.emit('order:changed', this._order);
	}
}
