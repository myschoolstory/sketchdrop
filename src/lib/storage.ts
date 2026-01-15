const STORAGE_KEY = 'sketchdrop_my_sketches';
export function saveShareId(id: string): void {
  const ids = getMyShareIds();
  if (!ids.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, id]));
  }
}
export function getMyShareIds(): string[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse local sketches', e);
    return [];
  }
}
export function removeShareId(id: string): void {
  const ids = getMyShareIds();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.filter(i => i !== id)));
}