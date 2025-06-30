/**
 * Преобразует строку в слаг (латиница, без пробелов/сервисных символов).
 * Используется для путей картинок героев/стилей.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "")
    .replace(/_/g, "");
}
