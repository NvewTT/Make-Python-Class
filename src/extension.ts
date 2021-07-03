// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, commands, ExtensionContext,Range, Position } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	
	let disposable = commands.registerCommand('make-python-class.helloWorld', () => {
		const editor = window.activeTextEditor;
		
		if(!editor){
			window.showInformationMessage('Editor não existe');
			return;
		}
		const result = window.createInputBox();
		result.value = "";
		result.placeholder = "Ex: Name,ID,Number"
		result.prompt = "Enter an paraments for your constructor."
		result.title = "Make Python Class"
		result.onDidAccept(text =>{
			const textoArray = result.value.split(",");
			const init = `def __init__(self,${textoArray.join()}):`;
			let zonaVariaveis = textoArray.map(variavel =>{
				return `\t\tself.${variavel} = ${variavel}\n`;
			});
			let slotsVariaveis = textoArray.map(variavel =>{
				return `'${variavel}'`;
			});
			const pathString = editor.document.fileName.split(/\\/).pop()?.split('.')[0];
			let textoFinal = `class ${pathString}:\n\t__slots__ = [${slotsVariaveis}]\n\t${init}\n${zonaVariaveis.join("")}`;
			editor.edit(editBuilder => {
				editBuilder.replace(new Range(new Position(0,0),new Position(6,0)), textoFinal);
			});
			result.dispose();
		});
		result.show();
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
