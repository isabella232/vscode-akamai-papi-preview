import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import debug from './debug';

export default class PreviewPanel {
	static show(context: vscode.ExtensionContext, panel: vscode.WebviewPanel) {
		const outline = new PreviewPanel(context, panel);
	}

	readonly context: vscode.ExtensionContext;
	readonly panel: vscode.WebviewPanel;

	private constructor(context: vscode.ExtensionContext, panel: vscode.WebviewPanel) {
		this.context = context;
		this.panel = panel;
		this.create();
		this.reveal();
	}

	private get webview(): vscode.Webview {
		return this.panel.webview;
	}

	private get initialData(): any {
		return JSON.stringify({
			left: JSON.parse(fs.readFileSync("/Users/ahogg/git/vscode-akamai-papi-preview/tmp/rules-left.json", "utf8")),
			right: JSON.parse(fs.readFileSync("/Users/ahogg/git/vscode-akamai-papi-preview/tmp/rules-right.json", "utf8")),
		});
	}

	private getUri(...components: string[]): vscode.Uri {
		return vscode.Uri.joinPath(this.context.extensionUri, ...components).with({scheme: "vscode-resource"});
	}

	public create() {
		debug.append(this.initialData);
		this.panel.webview.html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src ${this.webview.cspSource}; img-src 'unsafe-inline' ${this.webview.cspSource} https:; script-src 'unsafe-inline' 'unsafe-eval' ${this.webview.cspSource}; style-src 'unsafe-inline' ${this.webview.cspSource};">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>${this.panel.title}</title>
			</head>
			<body>
			</body>
			<script>
				window.initialData = ${JSON.stringify(escape(this.initialData))};
			</script>
			<script src="${this.getUri("dist", "preview-panel.js")}"></script>
			</html>
		`;
	}

	public reveal() {
		this.panel.reveal();
	}
}
