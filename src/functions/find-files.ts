import * as fastGlob from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import ignore from 'ignore';
import { join, relative } from 'path';

export async function findFiles(
  baseDir: string,
  include: string[], // Include patterns
  exclude: string[], // Exclude patterns
  allowRecursion: boolean = true, // Toggle recursive search
  respectGitignore: boolean = false // Toggle .gitignore usage
): Promise<string[]> {
  // If we need to respect .gitignore, we need to load it
  let gitignore;
  if (respectGitignore) {
    const gitignorePath = join(baseDir, '.gitignore');
    // Load .gitignore if it exists
    if (existsSync(gitignorePath)) {
      gitignore = ignore().add(readFileSync(gitignorePath, 'utf8'));
    }
  }

  // Configure fast-glob options
  const options = {
    cwd: baseDir, // Base directory
    absolute: true, // Return absolute paths
    onlyFiles: false, // Return files and directories
    deep: allowRecursion ? Infinity : 1, // Toggle recursion
    ignore: exclude, // Exclude patterns
  };

  try {
    // Use fast-glob to find matching files
    const filePaths = await fastGlob(include, options);

    // Filter out files ignored by .gitignore patterns
    const filteredPaths = gitignore
      ? filePaths.filter((filePath) => {
          const relativePath = relative(baseDir, filePath); // Convert to relative paths
          return !gitignore.ignores(relativePath);
        })
      : filePaths;

    // Return the list of files
    return filteredPaths.sort((a, b) => {
      // Alphabetical order
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });
  } catch (error) {
    console.error('Error while finding files:', error);
    throw error; // Re-throw error for upstream handling
  }
}
