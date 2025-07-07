# Markdown Folder Structure for VS Code

![Extension Banner or Logo](./src/assets/drawstructurelogo.png)

A Visual Studio Code extension designed to visually represent your project's folder and file structure in Markdown format. Ideal for documentation and overview purposes, this tool simplifies the process of sharing and understanding project structures.
This extension works with vscode version 1.81.0 or higher

## Key Features

- **Quick and Easy Visualization**: Instantly generate a Markdown representation of your folder structure with a single click.
- **Customizable Designs**: Choose from a variety of formats for your structure representation.
- **Automatic Formatting**: Newly added automatic backticks wrapping for proper Markdown code formatting.
- **Clipboard Integration**: Automatically copies the generated structure to the clipboard with user notification for easy pasting.
- **Enhanced Usability**: Designed for convenience, making folder structure sharing effortless.
- **Flexible Exclusions**: Exclude specific files and folders using glob patterns for more precise control over the generated structure.

## Usage

1. Navigate to the file explorer in VS Code.
2. Right-click on a folder or file.
3. Select "Generate Markdown structure" from the context menu.
4. Enjoy your folder structure in Markdown format!

## Screenshots

![Basic Usage](./src/assets/screen01.png)

_Click on the option "Generate Markdown structure"._

![Another Feature](./src/assets/screen02.png)

_A file with the drawing of the structure will be generated._

## Customization

You can customize the folder structure drawing by excluding specific folders or files, selecting from various layout styles, and fine-tuning the search behavior. This section explains all the available configuration options in detail.

### Exclude Folders and Files

You have full control over which folders and files are included or excluded in the generated structure. For instance, if you want to skip common directories like "node_modules" or "dist," you can set the `draw.folder.structure.exclude` option in your **settings.json**. This configuration accepts glob patterns, allowing you to exclude items based on file names, extensions, or entire directories.

**Examples of exclusion patterns:**

- **Exclude specific folders:**
  `"**/node_modules", "**/dist"`

- **Exclude specific files:**
  `"**/archivo1.txt", "**/archivo2.js"`

- **Exclude by file extension:**
  `"**/*.log", "**/*.tmp"`

_Note:_ The extension comes with a default set of excluded folders and files. You can modify or extend these patterns to suit your project’s needs.

### Choose the Design You Like Best

The extension offers a variety of predefined styles to render the folder structure. By default, it uses the "EmojiDashes" style, but you can choose from several other designs to match your visual preference.

**Available styles include:**

- ClassicDashes
- SparklesDesing
- TrailDesign
- FloralDesign
- GalacticDesign
- MinimalistDots
- EmojiDashes
- EmojiFun
- EmojiMinimalist
- Arrows
- NestedCircles
- BoldBlocks
- SlashSeparators
- ChevronIndicators
- DotDashMix
- Triangles
- Zigzag
- PipesAndHyphens
- NestedSquares
- CirclesAndLines

This allows you to personalize the appearance of your Markdown output according to your taste.

### Recursion and .gitignore Settings

In addition to exclusions and style selection, the extension provides two extra settings that control how the file search is performed:

#### allowRecursion

This setting determines whether the search is conducted recursively within the selected folder.

- **`true` (default):**
  The extension will explore all subdirectories under the base folder, generating a complete and detailed project tree.

- **`false`:**
  Only the files and folders in the root of the selected directory are included, giving you a shallower structure without delving into subdirectories.

#### respectGitignore

This setting instructs the extension whether to honor the rules defined in your project’s **`.gitignore`** file.

- **`true`:**
  The extension loads the `.gitignore` file (if it exists) and excludes any files or folders that match the specified patterns. This is useful for omitting dependencies or temporary files that aren’t relevant to the structure view.

- **`false` (default):**
  All files and folders are included, regardless of what is defined in `.gitignore`.

### Example Configuration in settings.json

Here’s an example of how you can configure all these options in your **settings.json**:

```json
{
  "draw.folder.structure.exclude": ["**/node_modules", "**/dist"],
  "draw.folder.structure.style": "EmojiDashes",
  "draw.folder.structure.allowRecursion": true,
  "draw.folder.structure.respectGitignore": false
}
```

Adjust these options to suit your needs. For example, if you prefer a less detailed, top-level structure, set `allowRecursion` to `false`. If you want to ignore files specified in your `.gitignore`, enable `respectGitignore` by setting it to `true`.

![Customization Settings](./src/assets/screen03.png)
![Design Options](./src/assets/cap-style-screen.gif)

## Installation and Usage

1. Install the extension via Visual Studio Code Marketplace.
2. Right-click on the desired folder in your VS Code file explorer.
3. Select 'Generate Markdown Structure' from the context menu.
4. The Markdown representation of the folder structure is automatically copied to your clipboard.
5. Paste it into your Markdown file or documentation as needed.

## Telemetría y Privacidad

Esta extensión recopila datos de rendimiento anónimos para ayudar a mejorar la funcionalidad.

### ¿Qué se recopila?

- Métricas de rendimiento y uso (sin datos personales)
- Información técnica de errores para mejorar la estabilidad
- Estadísticas de uso de características

### ¿Qué NO se recopila?

- Contenido de archivos o rutas específicas
- Información personal identificable
- Datos sensibles del proyecto

Todos los datos son anónimos y se utilizan únicamente para mejorar la extensión. Para más detalles sobre privacidad, consulta [AZURE_INSIGHTS_SETUP.md](./AZURE_INSIGHTS_SETUP.md).

## Support and Contribution

For support queries or to contribute to this project, please visit our GitHub repository or contact us at [jm.krivocapich@gmail.com]('').

## Contributions

Contributions are welcome. If you encounter any problems or have any suggestions, please open an issue in the GitHub repository. We also invite you to read [How to contribute](./CONTRIBUTING.md)

## Made by

**Krivoox**
[Follow me on X](https://twitter.com/jkrivoox)
[My linkedin](https://www.linkedin.com/in/juan-manuel-krivocapich/)

## License

[MIT](./LICENSE.md)
