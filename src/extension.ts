import * as vscode from 'vscode';
import { ModelParser } from './parser';
import { CodeGenerator } from './generator';

// Точка входа плагина
export function activate(context: vscode.ExtensionContext): void {
    // Регистрация команды генерации
    const disposable = vscode.commands.registerCommand('data-class-generator.generate', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('Откройте текстовый редактор для генерации класса.');
            return;
        }

        const selection = editor.selection;
        let inputText = editor.document.getText(selection).trim();

        // Если текст не выделен, запрашиваем схему через InputBox
        if (!inputText) {
            const userInput = await vscode.window.showInputBox({
                prompt: 'Введите схему класса (например, User: id: int, user_name: str, is_active: bool)',
                placeHolder: 'User: id: int, user_name: str, is_active: bool'
            });

            if (!userInput) {
                return;
            }
            inputText = userInput;
        }

        try {
            // Парсинг схемы и генерация кода
            const model = ModelParser.parse(inputText);
            const generatedCode = CodeGenerator.generate(model);

            // Замена выделения или вставка на позицию курсора
            await editor.edit(editBuilder => {
                if (selection.isEmpty) {
                    editBuilder.insert(selection.active, generatedCode);
                } else {
                    editBuilder.replace(selection, generatedCode);
                }
            });

            vscode.window.showInformationMessage(`Класс "${model.className}" и его Builder успешно сгенерированы!`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            vscode.window.showErrorMessage(`Ошибка генерации: ${message}`);
        }
    });

    // Регистрация команды в подписках для освобождения ресурсов
    context.subscriptions.push(disposable);
}

// Вызывается при деактивации плагина
export function deactivate(): void {}
