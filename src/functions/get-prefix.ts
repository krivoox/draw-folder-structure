export enum Style {
  dashes = 'dashes',
  dots = 'dots',
  emojis = 'emojis',
  arrows = 'arrows',
}

export type GetPrefixFunction = (
  depth: number,
  style: Style,
  isFile?: boolean
) => string;

export const getPrefix: GetPrefixFunction = (depth, style, isFile = false) => {
  const repeatStr = '  '.repeat(depth);
  const filePrefixes: Record<Style, string> = {
    [Style.dashes]: `${repeatStr}├── `,
    [Style.dots]: `${repeatStr}• `,
    [Style.emojis]: `${repeatStr}└──📄 `,
    [Style.arrows]: `${repeatStr}➤ `,
  };

  const folderPrefixes: Record<Style, string> = {
    [Style.dashes]: `${repeatStr}└── `,
    [Style.dots]: `${repeatStr}• `,
    [Style.emojis]: `${repeatStr}└──📁 `,
    [Style.arrows]: `${repeatStr}➤ `,
  };

  return isFile ? filePrefixes[style] : folderPrefixes[style];
};
