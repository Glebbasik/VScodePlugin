// Описание отдельного поля класса
export interface FieldDefinition {
    name: string;         // Имя поля в camelCase
    rawType: string;      // Исходный тип из строки
    targetType: string;   // Тип TypeScript
    defaultValue: string; // Дефолтное значение
}

// Модель распарсенного класса
export interface ClassModel {
    className: string;         // Имя класса в PascalCase
    fields: FieldDefinition[]; // Список полей класса
}
