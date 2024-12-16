import * as fastGlob from "fast-glob";
import { existsSync, readFileSync, statSync } from "fs";
import ignore, { Ignore } from "ignore";
import { join, relative, sep } from "path";

export async function findFiles(
  baseDir: string,
  include: string[], // Include patterns
  exclude: string[], // Exclude patterns
  allowRecursion: boolean = true, // Toggle recursive search
  respectGitignore: boolean = false // Toggle .gitignore usage
): Promise<string[]> {
  // If we need to respect .gitignore, we need to load it
  let gitignore: Ignore | undefined;
  if (respectGitignore) {
    const gitignorePath = join(baseDir, ".gitignore");
    // Load .gitignore if it exists
    if (existsSync(gitignorePath)) {
      gitignore = ignore().add(readFileSync(gitignorePath, "utf8"));
    }
  }

  // Configure fast-glob options
  const options = {
    cwd: baseDir, // Base directory
    absolute: true, // Return absolute paths
    onlyFiles: false, // Return files and directories
    dot: true, // Include files starting with a dot
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
          return gitignore ? !gitignore.ignores(relativePath) : true;
        })
      : filePaths;

    // Separate base level files from
    const baseLevelFiles = [];
    const otherFiles = [];
    for (const file of filteredPaths) {
      const relativePath = relative(baseDir, file);
      const depth = relativePath.split(sep).length - 1;
      const isFolder = statSync(file).isDirectory();

      if (depth === 0 && !isFolder) {
        // Add base level files to a separate list
        baseLevelFiles.push(file);
      } else {
        // Add other files to a separate list
        otherFiles.push(file);
      }
    }

    // Sort files: Other files first, then base level files
    return [
      ...otherFiles.sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      ), // Sort case-insensitively
      ...baseLevelFiles.sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      ), // Sort case-insensitively
    ];
  } catch (error) {
    console.error("Error while finding files:", error);
    throw error; // Re-throw error for upstream handling
  }
}
