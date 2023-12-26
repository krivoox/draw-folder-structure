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

You can customize which folders and files to exclude in the drawing, as well as choose from many markdown layouts.

##### Exclude folders or files as you like

For example: "node_module" (Excluded by default).
Just add in your **settings.json** file the line **"draw.folder.structure.exclude"** and it will show you the default excluded folders and files.
You can modify it to your liking!

![Custom Setting](./src/assets/screen03.png)

#### Choose the design you like best

Choose from a lot of predefined designs we have to offer. By default we use "EmojiDashes".

**List of styles:**

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

![Custom Setting](./src/assets/cap-style-screen.gif)

## Installation and Usage

1. Install the extension via Visual Studio Code Marketplace.
2. Right-click on the desired folder in your VS Code file explorer.
3. Select 'Generate Markdown Structure' from the context menu.
4. The Markdown representation of the folder structure is automatically copied to your clipboard.
5. Paste it into your Markdown file or documentation as needed.

## Support and Contribution

For support queries or to contribute to this project, please visit our GitHub repository or contact us at [jm.krivocapich@gmail.com]('').

#### Contributions

Contributions are welcome. If you encounter any problems or have any suggestions, please open an issue in the GitHub repository. We also invite you to read [How to contribute](./CONTRIBUTING.md)

## Made by

**Krivoox**
[Follow me on X](https://twitter.com/jkrivoox)
[My linkedin](https://www.linkedin.com/in/juan-manuel-krivocapich/)

## License

[MIT](./LICENSE.md)
