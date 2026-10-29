import { ClassModel } from './models';
import { ModelParser } from './parser';

export class CodeGenerator {
    // Генерация кода класса и сопутствующего Builder
    public static generate(model: ClassModel): string {
        const lines: string[] = [];
        const { className, fields } = model;

        lines.push('/**');
        lines.push(` * Автоматически сгенерированный класс данных ${className}.`);
        lines.push(' */');
        lines.push(`export class ${className} {`);

        // Приватные поля
        for (const field of fields) {
            lines.push(`    private _${field.name}: ${field.targetType};`);
        }
        lines.push('');

        // Конструктор со значениями по умолчанию
        const constructorParams = fields
            .map(f => `${f.name}: ${f.targetType} = ${f.defaultValue}`)
            .join(', ');
        lines.push(`    constructor(${constructorParams}) {`);
        for (const field of fields) {
            lines.push(`        this._${field.name} = ${field.name};`);
        }
        lines.push('    }');
        lines.push('');

        // Геттеры и сеттеры
        for (const field of fields) {
            const capitalized = ModelParser.toPascalCase(field.name);
            lines.push(`    public get${capitalized}(): ${field.targetType} {`);
            lines.push(`        return this._${field.name};`);
            lines.push('    }');
            lines.push('');

            lines.push(`    public set${capitalized}(value: ${field.targetType}): void {`);
            lines.push(`        this._${field.name} = value;`);
            lines.push('    }');
            lines.push('');
        }

        // Метод toString
        const toStringParts = fields
            .map(f => "'" + f.name + "=' + this._" + f.name)
            .join(" + ', ' + ");
        lines.push('    public toString(): string {');
        lines.push(`        return '${className} { ' + ${toStringParts || "''"} + ' }';`);
        lines.push('    }');
        lines.push('');

        // Фабричный метод для Builder
        lines.push(`    public static builder(): ${className}Builder {`);
        lines.push(`        return new ${className}Builder();`);
        lines.push('    }');
        lines.push('}');
        lines.push('');

        // Класс Builder для пошаговой инициализации
        lines.push('/**');
        lines.push(` * Паттерн Builder для пошагового создания экземпляра ${className}.`);
        lines.push(' */');
        lines.push(`export class ${className}Builder {`);
        for (const field of fields) {
            lines.push(`    private ${field.name}: ${field.targetType} = ${field.defaultValue};`);
        }
        lines.push('');

        // Методы with<Field>
        for (const field of fields) {
            const methodSuffix = ModelParser.toPascalCase(field.name);
            lines.push(`    public with${methodSuffix}(value: ${field.targetType}): this {`);
            lines.push(`        this.${field.name} = value;`);
            lines.push('        return this;');
            lines.push('    }');
            lines.push('');
        }

        // Метод build
        const buildArgs = fields.map(f => `this.${f.name}`).join(', ');
        lines.push(`    public build(): ${className} {`);
        lines.push(`        return new ${className}(${buildArgs});`);
        lines.push('    }');
        lines.push('}');

        return lines.join('\n');
    }
}
