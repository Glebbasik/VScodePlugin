import { ClassModel, FieldDefinition } from './models';

export class ModelParser {
    // Таблица соответствия входных типов типам TypeScript
    private static readonly typeMap: Map<string, string> = new Map<string, string>([
        ['int', 'number'],
        ['integer', 'number'],
        ['float', 'number'],
        ['double', 'number'],
        ['number', 'number'],
        ['str', 'string'],
        ['string', 'string'],
        ['text', 'string'],
        ['bool', 'boolean'],
        ['boolean', 'boolean'],
        ['any', 'any'],
        ['date', 'Date'],
        ['list', 'any[]'],
        ['array', 'any[]']
    ]);

    // Значения по умолчанию для типов
    private static readonly defaultValuesMap: Map<string, string> = new Map<string, string>([
        ['number', '0'],
        ['string', "''"],
        ['boolean', 'false'],
        ['Date', 'new Date()'],
        ['any[]', '[]'],
        ['any', 'null']
    ]);

    // Парсинг строки вида: "ClassName: field1: type1, field2: type2"
    public static parse(input: string): ClassModel {
        const trimmed = input.trim();
        if (!trimmed) {
            throw new Error('Выделенная строка пуста.');
        }

        // Поиск разделителя между именем класса и полями
        const firstColonIndex = trimmed.indexOf(':');
        if (firstColonIndex === -1) {
            throw new Error('Неверный формат. Ожидается: "ClassName: field1: type1, field2: type2"');
        }

        const rawClassName = trimmed.substring(0, firstColonIndex).trim();
        const fieldsSegment = trimmed.substring(firstColonIndex + 1).trim();

        // Проверка корректности имени класса
        if (!rawClassName || !/^[a-zA-Z_]\w*$/.test(rawClassName)) {
            throw new Error(`Некорректное имя класса: "${rawClassName}"`);
        }

        if (!fieldsSegment) {
            throw new Error('Список полей класса не может быть пустым.');
        }

        const className = this.toPascalCase(rawClassName);
        const rawFields = fieldsSegment.split(',');
        const fields: FieldDefinition[] = [];

        // Разбор каждого поля
        for (const rawField of rawFields) {
            const parts = rawField.split(':').map(p => p.trim());
            if (parts.length !== 2 || !parts[0] || !parts[1]) {
                throw new Error(`Ошибка в описании поля "${rawField}". Ожидается "имя: тип".`);
            }

            const [rawFieldName, rawType] = parts;
            if (!/^[a-zA-Z_]\w*$/.test(rawFieldName)) {
                throw new Error(`Некорректное имя поля: "${rawFieldName}"`);
            }

            const name = this.toCamelCase(rawFieldName);
            const normalizedRawType = rawType.toLowerCase();
            const targetType = this.typeMap.get(normalizedRawType) || rawType;
            const defaultValue = this.defaultValuesMap.get(targetType) || 'null';

            fields.push({
                name,
                rawType,
                targetType,
                defaultValue
            });
        }

        return { className, fields };
    }

    // Приведение к PascalCase (user_name -> UserName)
    public static toPascalCase(text: string): string {
        return text
            .split(/[\s_]+/)
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    // Приведение к camelCase (user_name -> userName)
    public static toCamelCase(text: string): string {
        const pascal = this.toPascalCase(text);
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }
}
