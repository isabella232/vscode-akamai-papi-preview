// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitExtension } from '../../vendor/types/git';
import debug from './debug';
import PreviewPanel from './previewPanel';

const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git').exports;
const git = gitExtension.getAPI(1);


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	debug.show();

	context.subscriptions.push(
		vscode.commands.registerCommand('akamai-papi-preview.preview', function () {
			if (vscode.window.activeTextEditor) {
				let relFileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor?.document.fileName);

				PreviewPanel.show(
					context,
					vscode.window.createWebviewPanel(
						"akamai-papi-preview.preview-panel",
						`Preview: ${relFileName}`,
						vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One,
						{
							enableFindWidget: true,
							retainContextWhenHidden: false,
							enableScripts: true,
						}
					)
				)
			}
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
