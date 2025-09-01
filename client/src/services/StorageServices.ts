// services/StorageService.ts
export class StorageService {
  static get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }
  static set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  static remove(key: string) {
    localStorage.removeItem(key);
  }
}
