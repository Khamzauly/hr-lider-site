export function normalizePublicText(value: string): string {
  return value.replace(/—/g, "-");
}

export function normalizePublicContent<T>(value: T): T {
  if (typeof value === "string") {
    return normalizePublicText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizePublicContent(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizePublicContent(item)])
    ) as T;
  }

  return value;
}
