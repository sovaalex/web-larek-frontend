export interface IPage {
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IBaseItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard extends IBaseItem {
	buttonText: string;
	itemCount: number | string;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number | string;
	selected: string[];
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm, IContactsForm {
	total: number | string;
	items: string[];
}

export interface IContacts extends IContactsForm {
	items: string[];
}

export interface IClick {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
	id: string;
	total: number;
}
