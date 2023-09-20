export function shouldExclude(name: string, patterns: string[]): boolean {
  return patterns.some((pattern) => name.includes(pattern));
}
