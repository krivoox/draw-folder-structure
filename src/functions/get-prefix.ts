import { Style } from '../types/style';

export type GetPrefixFunction = (
  depth: number,
  style: Style,
  isFile?: boolean
) => string;

export const getPrefix: GetPrefixFunction = (depth, style, isFile = false) => {
  const repeatStr = '  '.repeat(depth);

  const folderPrefixes: Record<Style, string> = {
    [Style.ClassicDashes]: `${repeatStr}└── `,
    [Style.MinimalistDots]: `${repeatStr} • `,
    [Style.EmojiFun]: `${repeatStr}📁 `,
    [Style.EmojiMinimalist]: `${repeatStr}📁 `,
    [Style.Arrows]: `${repeatStr}➜ `,
    [Style.NestedCircles]: `${repeatStr}◉ `,
    [Style.BoldBlocks]: `${repeatStr}■ `,
    [Style.SlashSeparators]: `${repeatStr}/ `,
    [Style.ChevronIndicators]: `${repeatStr}» `,
    [Style.DotDashMix]: `${repeatStr}• `,
    [Style.Triangles]: `${repeatStr}▶ `,
    [Style.Zigzag]: `${repeatStr}↳ `,
    [Style.PipesAndHyphens]: `${repeatStr}|- `,
    [Style.NestedSquares]: `${repeatStr}■ `,
    [Style.CirclesAndLines]: `${repeatStr}◯ `,
    [Style.SparklesDesing]: `${repeatStr}📁✨ `,
    [Style.TrailDesign]: `${repeatStr}👣📁 `,
    [Style.FloralDesign]: `${repeatStr}🌸📁 `,
    [Style.GalacticDesign]: `${repeatStr}🌌📁 `,
  };

  const filePrefixes: Record<Style, string> = {
    [Style.ClassicDashes]: `${repeatStr}├── `,
    [Style.MinimalistDots]: `${repeatStr}• `,
    [Style.EmojiFun]: `${repeatStr}📄 `,
    [Style.EmojiMinimalist]: `${repeatStr}─ `,
    [Style.Arrows]: `${repeatStr}➜ `,
    [Style.NestedCircles]: `${repeatStr}○ `,
    [Style.BoldBlocks]: `${repeatStr}■ `,
    [Style.SlashSeparators]: `${repeatStr}/ `,
    [Style.ChevronIndicators]: `${repeatStr}» `,
    [Style.DotDashMix]: `${repeatStr}- `,
    [Style.Triangles]: `${repeatStr}▶ `,
    [Style.Zigzag]: `${repeatStr}↳ `,
    [Style.PipesAndHyphens]: `${repeatStr}|- `,
    [Style.NestedSquares]: `${repeatStr}□ `,
    [Style.CirclesAndLines]: `${repeatStr}─ `,
    [Style.SparklesDesing]: `${repeatStr}✨ `,
    [Style.TrailDesign]: `${repeatStr}👣📄 `,
    [Style.FloralDesign]: `${repeatStr}🌸📄 `,
    [Style.GalacticDesign]: `${repeatStr}🌌📄 `,
  };

  return isFile ? filePrefixes[style] : folderPrefixes[style];
};
