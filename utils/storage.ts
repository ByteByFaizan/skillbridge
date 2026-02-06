/**
 * Safe storage utilities with SSR compatibility
 */

export const storage = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  getJSON<T>(key: string): T | null {
    const raw = this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setJSON<T>(key: string, value: T): boolean {
    try {
      return this.set(key, JSON.stringify(value));
    } catch {
      return false;
    }
  },
};

export const localStore = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  getJSON<T>(key: string): T | null {
    const raw = this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setJSON<T>(key: string, value: T): boolean {
    try {
      return this.set(key, JSON.stringify(value));
    } catch {
      return false;
    }
  },
};
