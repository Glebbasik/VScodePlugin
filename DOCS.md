# Техническая документация проекта Data Class & Builder Generator

## 1. Архитектура плагина

Плагин разделен на 4 модуля в каталоге src/:

- models.ts — структуры данных (FieldDefinition, ClassModel).
- parser.ts — разбор входной строки, валидация полей, создаёт объект типа ClassModel для дальнейшей генерации в файле.
- generator.ts — генерация синтаксических конструкций класса и паттерна Builder.
- extension.ts — точка входа и регистрация команд в VS Code API.

## 2. Описание структур данных и методов

### Интерфейс FieldDefinition

- name: string — имя свойства (camelCase).
- rawType: string — исходный тип.
- targetType: string — целевой тип TypeScript.
- defaultValue: string — дефолтное значение для инициализации.

### Интерфейс ClassModel

- className: string — имя класса (PascalCase).
- fields: FieldDefinition[] — массив свойств.

### Класс ModelParser

- static parse(input: string): ClassModel — валидация и парсинг текста схемы.
- static toPascalCase(text: string): string — приведение к PascalCase.
- static toCamelCase(text: string): string — приведение к camelCase.

### Класс CodeGenerator

- static generate(model: ClassModel): string — формирование результирующего кода.
