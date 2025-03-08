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
  // Load .gitignore if needed
  let gitignore;
  if (respectGitignore) {
    const gitignorePath = join(baseDir, '.gitignore');
    if (existsSync(gitignorePath)) {
      gitignore = ignore().add(readFileSync(gitignorePath, "utf8"));
    }
  }

  // Configure fast-glob options
  const options = {
    cwd: baseDir,              // Base directory
    absolute: true,            // Return absolute paths
    onlyFiles: false,          // Return files and directories
    dot: true,                 // Include dotfiles
    deep: allowRecursion ? Infinity : 1, // Recursive or not
    ignore: exclude,           // Exclude patterns
  };

  try {
    // Retrieve matching paths using fast-glob
    const filePaths = await fastGlob(include, options);

    // Filter out paths that match .gitignore patterns, if enabled
    let filteredPaths = gitignore
      ? filePaths.filter((filePath) => {
        const relativePath = relative(baseDir, filePath);
        return !gitignore.ignores(relativePath);
      })
      : filePaths;

    // Custom sorting: for each directory level, ensure directories come before files.
    filteredPaths.sort((a, b) => {
      // Get the paths relative to the base directory.
      const aRel = relative(baseDir, a);
      const bRel = relative(baseDir, b);
      // Split the relative paths into segments.
      const aParts = aRel.split(sep);
      const bParts = bRel.split(sep);
      const minLen = Math.min(aParts.length, bParts.length);

      // Compare each segment.
      for (let i = 0; i < minLen; i++) {
        if (aParts[i] !== bParts[i]) {
          // Build the partial paths up to the current segment.
          const aSegmentPath = join(baseDir, ...aParts.slice(0, i + 1));
          const bSegmentPath = join(baseDir, ...bParts.slice(0, i + 1));
          // Determine if the segment represents a directory.
          const aIsDir = statSync(aSegmentPath).isDirectory();
          const bIsDir = statSync(bSegmentPath).isDirectory();
          // If one segment is a directory and the other is not, order the directory first.
          if (aIsDir && !bIsDir) { return -1; }
          if (!aIsDir && bIsDir) { return 1; }
          // If both segments are of the same type, sort alphabetically.
          return aParts[i].localeCompare(bParts[i]);
        }
      }
      // If all segments compared are equal, the path with fewer segments (i.e. the parent) comes first.
      return aParts.length - bParts.length;
    });

    return filteredPaths;
  } catch (error) {
    console.error('Error while finding files:', error);
    throw error;
  }
}
