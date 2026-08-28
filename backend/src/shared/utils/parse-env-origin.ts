export function parseEnvOrigins(...origin: (string | undefined)[]) {
  const out: string[] = [];
  for (const v of origin) {
    if (!v) continue;

    for (const part of v.split(',')) {
      const trimmed = part.trim();
      if (trimmed) out.push(trimmed);
    }
  }
  return [...new Set(out)];
}
