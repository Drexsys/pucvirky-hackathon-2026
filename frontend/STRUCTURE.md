# Frontend - Pucvirky Hackathon 2026

React додаток побудований на Vite.

## Структура проекту

```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx        + Header.css
│   │   └── Sidebar.jsx       + Sidebar.css
│   ├── orders/
│   │   ├── OrdersTable.jsx   + OrdersTable.css
│   │   ├── OrderFilters.jsx  + OrderFilters.css
│   │   ├── OrderRow.jsx      + OrderRow.css
│   │   └── TaxBreakdown.jsx  + TaxBreakdown.css
│   ├── import/
│   │   └── CsvImport.jsx     + CsvImport.css
│   ├── create/
│      └── CreateOrderForm.jsx + CreateOrderForm.css
│   
├── pages/
│   ├── OrdersPage.jsx        + OrdersPage.css
│   ├── ImportPage.jsx        + ImportPage.css
│   └── CreateOrderPage.jsx   + CreateOrderPage.css
├── App.jsx                   + App.css
└── index.css
```

## Встановлення

```bash
npm install
```

## Запуск в режимі розробки

```bash
npm run dev
```

Додаток буде доступний на `http://localhost:5173`

## Команди

- `npm run dev` - запуск в режимі розробки
- `npm run build` - створення production сборки
- `npm run preview` - предпросмотр сборки
- `npm run lint` - перевірка коду

## Стек технологій

- **React 19.2.0** - UI фреймворк
- **Vite 7.3.1** - Build tool
- **ESLint** - Linting

