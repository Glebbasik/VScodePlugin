# Data Class & Builder Generator

## Авторство

- ФИО: Барышников Глеб Юрьевич
- Группа: М3106

---

## Описание плагина

**Data Class & Builder Generator** — это плагин для IDE Visual Studio Code, предназначенный для автоматической генерации полноценных классов данных и классов строителей (паттерн Builder) из краткого текстового описания схемы.

## Основные возможности

1. **Парсинг кратких схем:** синтаксис `Имя класса: поле 1: тип 1, поле 2: тип 2`.
2. **Автоматическое приведение типов:** сопоставление `int`, `str`, `bool`, `float`, `date`, `list` с типами TypeScript (`number`, `string`, `boolean`, `Date`, `any[]`).
3. **Нормализация имен:** (тревиальное) преобразование имени класса согласно PascalCase, а полей согласно camelCase.
4. **Генерация паттерна Builder:** класс `<ИмяКласса>Builder` с цепочкой `with<Поле класса>()` и методом `build()`.
5. **Два режима работы:** замена выделения в редакторе (`Ctrl+Alt+G` / `Cmd+Alt+G`) или ввод через всплывающий InputBox.

## Пример работы

Входная строка:

```text
UserProfile: user_id: int, full_name: str, is_active: bool
```

Результат генерации:

```typescript
export class UserProfile {
  private _userId: number;
  private _fullName: string;
  private _isActive: boolean;

  constructor(
    userId: number = 0,
    fullName: string = "",
    isActive: boolean = false,
  ) {
    this._userId = userId;
    this._fullName = fullName;
    this._isActive = isActive;
  }
}
```

## Инструкция по сборке и запуску

1. Установите зависимости:
   npm install
2. Скомпилируйте проект:
   npm run compile
3. Запустите отладку клавишей F5 или с помощью вкладки "Run and Debug" в VScode.
4. В открывшемся окне выделите строку и нажмите Ctrl+Alt+G на Windows или Cmd+Alt+G на macOS.

## Документация проекта

Подробное описание находится в DOCS.md.
