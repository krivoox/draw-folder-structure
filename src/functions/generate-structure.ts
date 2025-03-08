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

  // Retrieve the sorted items using the optimized findFiles function.
  const items = await findFiles(
    folderPath,       // Base directory
    ['**/*'],         // Include all files and directories
    excludePatterns,  // Exclude patterns
    allowRecursion,   // Recursive search
    respectGitignore  // Respect .gitignore if enabled
  );

  // Iterate over each sorted item to build the structure.
  for (const [index, item] of items.entries()) {
    const fullPath = resolve(item); // Ensure full path
    const isFolder = statSync(fullPath).isDirectory();
    const isLastItem = index === items.length - 1;

    // Calculate the depth (number of subdirectories) based on the relative path.
    const currentDepth = fullPath.split(sep).length - folderPath.split(sep).length;

    // Get the prefix for the current item based on its depth, style, if it's the last item, and if it's a file.
    const prefix = getPrefix(currentDepth, style, isLastItem, !isFolder);

    // Append the item (using its basename) to the structure.
    structure += `${prefix}${basename(item)}\n`;
  }

  return structure;
}
