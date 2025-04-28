import * as vscode from 'vscode';
// Import a UUID generation library (e.g., 'uuid' npm package)
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5 } from 'uuid';

export function activate(context: vscode.ExtensionContext) {

  // Register the command defined in package.json
  const disposable = vscode.commands.registerCommand('pasteUUID.generate', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }

    // Get user settings for PasteUUID
    const config = vscode.workspace.getConfiguration('pasteuuid');
    const version = config.get<string>('uuidVersion', 'v4');
    const letterCase = config.get<string>('letterCase', 'lowercase');
    const includeHyphens = config.get<boolean>('includeHyphens', true);

    // Generate the UUID based on the selected version
    let newUuid: string;
    if (version === 'v1') {
      newUuid = uuidv1();
    } else if (version === 'v5') {
      // For v5, generate with a namespace (using DNS namespace as example)
      newUuid = uuidv5('pasteuuid', uuidv5.DNS);
    } else {
      // Default to v4
      newUuid = uuidv4();
    }

    // Apply formatting options (hyphens and letter case)
    if (!includeHyphens) {
      newUuid = newUuid.replace(/-/g, '');
    }
    if (letterCase === 'uppercase') {
      newUuid = newUuid.toUpperCase();
    } else {
      newUuid = newUuid.toLowerCase();
    }

    // Insert or replace text in the editor
    editor.edit(editBuilder => {
      // If there's a selection, replace it; otherwise insert at the cursor.
      editor.selections.forEach(selection => {
        if (selection.isEmpty) {
          editBuilder.insert(selection.start, newUuid);
        } else {
          editBuilder.replace(selection, newUuid);
        }
      });
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Clean up if necessary (not used in this simple extension)
}

