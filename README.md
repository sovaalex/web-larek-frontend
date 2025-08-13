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

Проект реализует паттерн MVP с событийно-ориентированной архитектурой для обеспечения слабой связанности компонентов.

### Структура паттерна:
- **Model** - управление данными и бизнес-логикой
- **View** - отображение UI компонентов
- **Presenter** - координация между Model и View
- **EventEmitter** - обеспечивает коммуникацию между слоями

---

## Слой Модели (Model Layer)

### Классы данных

#### **`IProduct` (src/types/index.ts)**
**Главная задача**: Определяет структуру товара в системе
- **Поля**:
  - `id: string` - уникальный идентификатор товара
  - `title: string` - название товара
  - `price: number` - цена в рублях
  - `category: string` - категория товара
  - `image: string` - URL изображения
  - `description: string` - описание товара

#### **`IOrder` (src/types/index.ts)**
**Главная задача**: Структура заказа для оформления покупки
- **Поля**:
  - `payment: string` - способ оплаты
  - `email: string` - email покупателя
  - `phone: string` - телефон покупателя
  - `address: string` - адрес доставки
  - `total: number` - общая сумма заказа
  - `items: string[]` - массив ID товаров

#### **`ISuccess` (src/types/index.ts)**
**Главная задача**: Ответ об успешном оформлении заказа
- **Поля**:
  - `id: string` - ID заказа
  - `total: number` - итоговая сумма

#### **`IBasketItem` (src/components/Basket.ts)**
**Главная задача**: Элемент корзины покупок
- **Поля**:
  - `id: string` - ID товара
  - `title: string` - название товара
  - `price: number` - цена за единицу
  - `quantity: number` - количество товара

### Сервисы и API

#### **`CustomAPI` (src/components/CustomAPI.ts)**
**Главная задача**: Сервис работы с backend API
- **Поля**:
  - `cdn: string` - базовый URL для изображений
  - `baseUrl: string` - базовый URL API
- **Методы**:
  - `getProductList(): Promise<IProduct[]>` - получение списка товаров
  - `orderResult(order: IOrder): Promise<ISuccess>` - отправка заказа

#### **`Api` (src/components/base/api.ts)**
**Главная задача**: Базовый класс для HTTP запросов
- **Методы**:
  - `get(uri: string): Promise<object>` - GET запрос
  - `post(uri: string, data: object): Promise<object>` - POST запрос

---

## Слой Представления (View Layer)

### Компоненты отображения

#### **`Item` (src/components/Item.ts)**
**Главная задача**: Отображение карточки товара в каталоге
- **Поля**:
  - `id: string` - уникальный идентификатор товара
  - `title: string` - название товара
  - `price: number` - цена товара
  - `category: string` - категория товара
  - `image: string` - URL изображения
  - `description: string` - описание товара
- **Методы**:
  - `render(product: IProduct): HTMLElement` - рендеринг карточки товара
  - Обработка кликов для открытия превью и добавления в корзину

#### **`Page` (src/components/Page.ts)**
**Главная задача**: Главная страница приложения
- **Поля**:
  - `basketCounter: number` - счетчик товаров в корзине
  - `catalogContainer: HTMLElement` - контейнер для каталога товаров
- **Методы**:
  - `setBasketCounter(count: number): void` - обновление счетчика корзины
  - `appendToCatalog(element: HTMLElement): void` - добавление товара в каталог
  - `toggleScroll(lock: boolean): void` - блокировка/разблокировка прокрутки
  - `clearCatalog(): void` - очистка каталога
  - `getItemById(id: string): any` - получение товара по ID

#### **`Modal` (src/components/Modal.ts)**
**Главная задача**: Базовый компонент модальных окон
- **Методы**:
  - `open(): void` - открытие модального окна
  - `close(): void` - закрытие модального окна
  - `setContent(content: HTMLElement): void` - установка контента

#### **`Basket` (src/components/Basket.ts)**
**Главная задача**: Корзина покупок
- **Поля**:
  - `items: IBasketItem[]` - массив товаров в корзине
  - `total: number` - общая стоимость
- **Методы**:
  - `addItem(item: IBasketItem): void` - добавление товара
  - `removeItem(id: string): void` - удаление товара
  - `updateQuantity(id: string, quantity: number): void` - обновление количества
  - `clear(): void` - очистка корзины
  - `getTotal(): number` - получение общей стоимости
  - `getItemCount(): number` - получение количества товаров
  - `hasItem(id: string): boolean` - проверка наличия товара

#### **`Form` (src/components/Form.ts)**
**Главная задача**: Формы заказа и контактных данных
- **Методы**:
  - Валидация и отправка данных заказа
  - Управление состоянием формы
  - Обработка событий формы

#### **`Success` (src/components/Success.ts)**
**Главная задача**: Компонент успешного оформления заказа
- **Отображение**: Итоговая сумма и подтверждение заказа

---

## Слой Презентера (Presenter Layer)

### Презентеры

#### **`ItemPresenter` (src/components/ItemPresenter.ts)**
**Главная задача**: Управление отображением товаров и обработка действий
- **Методы**:
  - `displayItems(items: any[]): void` - отображение списка товаров
  - `handleItemPreview(itemId: string): void` - обработка превью товара
  - `createItem(item: any): IViewItem` - создание компонента товара
  - `init(): void` - инициализация обработчиков событий

#### **`BasketPresenter` (src/components/BasketPresenter.ts)**
**Главная задача**: Управление корзиной и логикой оформления заказа
- **Методы**:
  - `handleAddToBasket(item: IBasketItem): void` - добавление в корзину
  - `handleRemoveFromBasket(itemId: string): void` - удаление из корзины
  - `handleUpdateQuantity(itemId: string, quantity: number): void` - обновление количества
  - `getBasketState(): { items: IBasketItem[], total: number }` - получение состояния корзины
  - `openBasket(): void` - открытие корзины
  - `init(): void` - инициализация обработчиков событий

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

## Взаимодействие между слоями через EventEmitter

### Пользовательские события:

#### **События корзины**:
- `basket:open` - открытие корзины
- `basket:add` - добавление товара в корзину
- `basket:remove` - удаление товара из корзины
- `basket:changed` - изменение состояния корзины
- `basket:checkout` - начало оформления заказа
- `basket:updateQuantity` - обновление количества товара

#### **События товаров**:
- `item:openPreview` - открытие превью товара
- `item:addToBasket` - добавление товара в корзину
- `items:loaded` - загрузка списка товаров

#### **События форм**:
- `order:submit` - отправка формы заказа
- `contacts:submit` - отправка формы контактов
- `form:submit` - общая отправка формы

#### **События модальных окон**:
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `success:close` - закрытие окна успеха