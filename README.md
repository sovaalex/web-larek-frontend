# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание модулей

### src/components/catalog.ts
Компонент каталога, отвечает за загрузку и отображение списка товаров.

### src/components/card.ts
Компонент карточки товара, отображает информацию о товаре и обрабатывает открытие модального окна с подробной информацией.

### src/components/cardPreview.ts
Компонент модального окна с подробной информацией о товаре, позволяет добавить товар в корзину.

### src/components/modal.ts
Базовый компонент модального окна, обеспечивает открытие и закрытие модальных окон.

### src/components/order.ts
Компонент оформления заказа, реализует многошаговую форму с выбором способа оплаты и вводом контактных данных.

### src/components/basket.ts
Компонент корзины, отображает список добавленных товаров и позволяет управлять ими.

### src/utils/constants.ts
Файл с константами, используемыми в проекте.

### src/utils/utils.ts
Вспомогательные функции общего назначения.

## Тестирование
- В заданном элементе html должен отображаться каталог товаров
- При нажатии на карточку должно открываться модальное окно с подробной информацией о карте
- Товары должны добавляться в корзину при нажатии кнопки "В корзину"
- Карточки и подробная информация должны отображать актуальные данные
- У форм оформления заказа должна быть валидация

## Паттерн проектирования

Проект реализует cобытийно-ориентированной подход.

---

## Слой Модели (Model Layer)

#### **`AppDataModel (src/components/DataModel.ts)**
**Главная задача**: Центральный класс управления данными приложения, наследует от EventEmitter и управляет состоянием приложения
- **Поля**:
  - `_products: IBaseItem[]` - массив товаров
  - `_basket: IBasketItem[]` - массив товаров в корзине
  - `_order: IOrder` - объект заказа с информацией об оплате, адресе, контактах
  - `_orderSuccess: ISuccess | null` - результат успешного оформления заказа
  - `_preview: string | null` - ID товара для предпросмотра
- **Методы**:
  - `get products(): IBaseItem[]` - получение списка товаров
  - `set products(products: IBaseItem[])` - установка списка товаров с генерацией события
  - `getProduct(id: string): IBaseItem | undefined` - получение товара по ID
  - `addToBasket(product: IBaseItem)` - добавление товара в корзину
  - `removeFromBasket(id: string)` - удаление товара из корзины
  - `get basket(): IBasketItem[]` - получение содержимого корзины
  - `get preparedBasketIds(): string[]` - получение массива ID товаров в корзине
 极 `get basketTotal(): number` - вычисление общей суммы корзины
  - `get basketCount(): number` - вычисление общего количества товаров в корзине
  - `clearBasket()` - очистка корзины
  - `setOrderField(field: keyof IOrderForm, value: string)` - установка поля заказа
  - `setContactsField(field: keyof IContactsForm, value: string)` - установка поля контактов
  - `get order(): IOrder` - получение объекта заказа
  - `set order(order: IOrder)` - установка объекта заказа
  - `validateOrder(): boolean` - валидация информации о заказе
  - `validateContacts(): boolean` - валидация контактной информации
  - `resetOrder()` - сброс заказа
- **События**:
  - `products:changed` - при изменении списка товаров
  - `basket:changed` - при изменении содержимого корзины
  - `order:changed` - при изменении информации о заказе

### Сервисы и API

#### **`CustomAPI` (src/components/CustomAPI.ts)**
**Главная задача**: Сервис работы с backend API
- **Поля**:
  - `cdn: string` - базовый URL для изображений
  - `baseUrl: string` - базовый URL API
- **Методы**:
  - `getProductList(): Promise<IBaseitem[]>` - получение списка товаров
  - `orderResult(order: IOrder): Promise<ISuccess>` - отправка заказа

#### **`Api` (src/components/base/api.ts)**
**Главная задача**: Базовый класс для HTTP запросов
- **Методы**:
  - `get(uri: string): Promise<object>` - GET запрос
  - `post(uri: string, data: object): Promise极object>` - POST запрос

---

## Слой Представления (View Layer)

### Компоненты отображения

#### **Component (src/components/base/Component.ts)**
**Главная задача**: Абстрактный класс для создания компонентов, обеспечивающий базовые методы для работы с элементами DOM.
- **Поля**:
  - `container: HTMLElement` - контейнер, в который будет рендериться компонент.
- **Методы**:
- `setText(element: HTMLElement, value: unknown): void` - устанавливает текстовое содержимое указанного элемента.
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - устанавливает источник и альтернативный текст для изображения.
- `setDisabled(element: HTMLElement, state: boolean): void` - устанавливает состояние "disabled" для указанного элемента.
- `render(data?: Partial<T>)`: HTM极Element - рендерит компонент, обновляя его данные на основе переданного объекта.

#### **Form (src/components/Form.ts)**
**Главная задача**: Базовый класс для создания форм, наследует от Component и предоставляет базовую функциональность для работы с формами
- **Поля**:
  - `_submitButton: HTMLButtonElement` - кнопка отправки формы
  - `_formErrors: HTMLSpanElement` - элемент для отображения ошибок формы
  - `fields: Map<string, HTMLInputElement>` - коллекция полей формы
- **Методы**:
  - `validateForm(): boolean` - валидация всей формы
  - `updateSubmitButton()` - обновление состояния кнопки отправки
  - `getFormData(): Record<string, string>` - получение данных формы
  - `setFormData(data: Record<string, string>)` - установка данных формы
  - `clearForm()` - очистка формы
  - `render(data: Partial<IFormBase>)` - рендеринг формы

#### **Modal (src/components/Modal.ts)**
**Главная задача**: Базовый компонент модального окна, обеспечивает открытие и закрытие модальных окон
- **Поля**:
  - `_closeButton: HTMLButtonElement` - кнопка закрытия модального окна
  - `_content: HTMLElement` - элемент содержимого модального окна
- **Методы**:
  - `open()` - открытие модального окна
  - `close()` - закрытие модального окна
  - `set content(value: HTMLElement)` - установка содержимого модального окна

#### **Basket (src/components/Basket.ts)**
**Главная задача**: Компонент корзины покупок, который управляет списком товаров и их общей стоимостью.
- **Поля**:
- `protected _items: HTMLElement - элемент, отображающий список товаров в корзине.
- `protected _price: HTMLElement - элемент, отображающий общую стоимость товаров в корзине.
- `protected _button: HTMLButtonElement - кнопка для оформления заказа.
- `protected _list: IBasketItem[] - массив товаров в корзине.
- **Методы**:
- `set items(items: IBasketItem[]): void` - устанавливает список товаров в корзине.
- `get items(): IBasket极Item[]` - возвращает текущий список товаров в корзине.
- `get total(): number` - вычисляет и возвращает общую стоимость товаров в корзине.
- `add(item: IBasketItem): void` - добавляет товар в корзину.
- `remove(itemId: string): void` - удаляет товар из корзины по его ID.
- `clear(): void` - очищает корзину.
- `极 itemsElement(): HTMLElement` - возвращает элемент, отображающий список товаров.
- `get priceElement(): HTMLElement` - возвращает элемент, отображающий общую стоимость.
- `get buttonElement(): HTMLButtonElement` - возвращает кнопку для оформления заказа.

#### **BasketItem (src/components/BasketItem.ts)**
**Главная задача**: Компонент, представляющий отдельный элемент в корзине покупок, отображающий информацию о товаре и предоставляющий возможность его удаления.
- **Поля**:
- `protected _title: HTMLElement` - элемент, отображающий название товара.
- `protected _price: HTMLElement` - элемент, отображающий цену товара.
- `protected _index: HTMLElement` - элемент, отображающий индекс товара в корзине.
- `protected _button: HTMLButtonElement` - кнопка для удаления товара из корзины.
- **Методы**:
- `set id(value: string): void` - устанавливает ID товара в атрибут data-id контейнера.
- `get id(): string` - возвращает ID товара из атрибута data-id контейнера.
- `set title(value: string): void` - устанавливает название товара.
- `get title(): string` - возвращает название товара.
- `set price(value: number | null): void` - устанавливает цену товара, отображая "Бесценно", если цена равна null.
- `set index(value: string): void` - устанавливает индекс товара в корзине.
- `get index(): string` - возвращает индекс товара.
- `render(): HTMLElement` - рендерит компонент и возвращает контейнер.

#### **Card (src/components/Card.ts)**
**Главная задача**: Компонент, представляющий карточку товара, отображающий информацию о товаре и предоставляющий возможность взаимодействия с ним.
- **Поля**:
- `protected _title: HTMLElement` - элемент, отображающий название товара.
- `protected _image: HTMLImageElement` - элемент, отображающий изображение товара.
- `protected _category: HTMLElement` - элемент, отображающий категорию товара.
- `protected _price: HTMLElement` - элемент, отображающий цену товара.
- `protected _description?: HTMLElement` - элемент, отображающий описание товара (необязательный).
- `protected _button: HTMLButtonElement` - кнопка для взаимодействия с товаром.
- `protected _index?: HTMLElement` - элемент, отображающий индекс товара (необязательный).
- `protected card: IBaseItem` - объект, представляющий данные товара.
- **Методы**:
- `set id(value: string): void` - устанавливает ID товара в атрибут data-id контейнера.
- `get id(): string` - возвращает ID товара из атрибута data-id контейнера.
- `set title(value: string): void` - устанавливает название товара.
- `get title(): string` - возвращает название товара.
- `set image(value: string): void` - устанавливает изображение товара.
- `set category(value: string):极 void` - устанавливает категорию товара и применяет соответствующий стиль.
- `set price(value: number | null): void` - устанавливает цену товара, отображая "Бесценно", если цена равна null, и отключает кнопку.
- `极 description(value: string): void` - устанавливает описание товара.
- `set buttonText(value: string): void` - устанавливает текст на кнопке.
- `极 index(value: string): void` - устанавливает индекс товара.
- `get index(): string` - возвращает индекс товара.
- `render(): HTMLElement` - рендерит компонент, обновляя его данные на основе переданного объекта, и возвращает контейнер.

#### **CardPreview (src/components/CardPreview.ts)**
**Главная задача**: Компонент, представляющий предварительный просмотр карточки товара, отображающий информацию о товаре с возможностью взаимодействия.
- **Поля**:
- `protected _description: HTMLElement` - элемент, отображающий описание товара.
- `protected _button: HTMLButtonElement` - кнопка для взаимодействия с товаром.
- **Методы**:
- `set description(value: string): void` - устанавливает описание товара.
- `set buttonText(value: string): void` - устанавливает текст на кнопке.
- `render(): HTMLElement` - рендерит компонент, обновляя его данные на основе переданного объекта, и возвращает контейнер, вызывая метод render родительского класса.

#### **ContactForm (src/components/ContactForm.ts)**
**Главная задача**: Компонент формы для ввода контактной информации, который управляет событиями формы и валидацией полей.
- **Поля**:
- `protected _contactForm: HTMLFormElement` - элемент формы для ввода контактной информации.
- `protected _dataModel: AppDataModel` - модель данных приложения, используемая для хранения и обработки введенной информации.
- **Методы**:
- `protected bindPaymentEvents(): void` - связывает события формы с обработчиками, отправляющими данные в модель данных при отправке формы.
- `protected validateField(name: string): boolean` - выполняет валидацию указанного поля формы, проверяя его значение и отображая сообщения об ошибках, если поле не валидно.

#### **Success (src/components/Success.ts)**
**Главная задача**: Компонент отображения успешного завершения заказа, показывает информацию о списанных синапсах и предоставляет кнопку для продолжения
- **Поля**:
  - `_button: HTMLButtonElement` - кнопка для продолжения после успешного заказа
  - `_label: HTMLParagraphElement` - элемент для отображения информации о списанных синапсах
  - `_callback: () => void` - callback-функция, вызываемая при нажатии на кнопку
- **Методы**:
  - `set callback(callback: () => void)` - установка callback-функции для кнопки
  - Отображает сообщение формата "Списано {total} синапсов" на основе данных из модели

---

## Система событий (Event Layer)

### **`EventEmitter` (src/components/base/events.ts)**
**Главная задача**: Централизованная система событий для коммуникации между компонентами
- **Ключевые методы**:
  - `on<T>(event: string, callback: (data: T) => void): void` - подписка на событие
  - `emit<T>(event: string, data?: T): void` - генерация события
  - `off(event: string, callback: Function): void` - отписка от события
  - `trigger<T>(event: string, context?: Partial<T>): (data: T) => void` - создание триггера

---
