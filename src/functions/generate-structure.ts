import { statSync } from 'fs';
import { basename, resolve, sep } from 'path';
import { Style } from '../types/style';
import { findFiles } from './find-files';
import { getPrefix } from './get-prefix';

export async function generateStructure(
  folderPath: string,
  excludePatterns: string[],
  style: Style,
  allowRecursion: boolean = true, // Toggle recursive search
  respectGitignore: boolean = false // Toggle .gitignore usage
): Promise<string> {
  let structure = '';

  const items = await findFiles(
    folderPath, // Base directory
    ['**/*'], // Include all files
    excludePatterns, // Exclude patterns
    allowRecursion, // Toggle recursion
    respectGitignore // Toggle .gitignore usage
  );

  // Iterate over each item and generate the structure
  for (const [index, item] of items.entries()) {
    const fullPath = resolve(item); // Ensure full path
    const isFolder = statSync(fullPath).isDirectory();
    const isLastItem = index === items.length - 1;

    // Calculate the depth of the current item
    const currentDepth =
      fullPath.split(sep).length - folderPath.split(sep).length;

    // Get the prefix for the current item
    const prefix = getPrefix(
      currentDepth, // Add one level for files
      style, // Style
      !isFolder, // Is file
      isLastItem // Is last item
    );

    // Add the item to the structure
    structure += `${prefix}${basename(item)}\n`;
  }

  return structure;
}
