import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { MenuItem, MENU_ITEMS } from '../data/menu';
import { db, handleFirestoreError, OperationType } from '../utils/firebase';

export interface TikTokVideoItem {
  id: string;
  url: string;
  videoId: string;
  caption?: string;
  coverUrl?: string;
  createdAt: number;
}

export interface AppSettings {
  pin: string;
  logoUrl: string | null;
  phone: string;
  whatsapp: string;
  venueName: string;
  venueFloor: string;
  googleMapsUrl: string;
  locationPhotoUrl: string | null;
  openingHoursFr: string;
  openingHoursEn: string;
  taglineFr: string;
  taglineEn: string;
  tiktokProfileUrl: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  pin: '123456',
  logoUrl: null,
  phone: '971586120042',
  whatsapp: '971586120042',
  venueName: 'Green Sea Plaza Restaurant',
  venueFloor: 'M - Floor',
  googleMapsUrl: '',
  locationPhotoUrl: null,
  openingHoursFr: 'Tous les jours : 11h30 – 01h30',
  openingHoursEn: 'Open Daily: 11:30 AM – 01:30 AM',
  taglineFr: 'Le goût authentique de l’Afrique. Une bouchée à la fois.',
  taglineEn: 'Authentic African Taste. One Bite at a Time!',
  tiktokProfileUrl: 'https://www.tiktok.com/@madame_dafe?_r=1&_t=ZS-9ARk5i5p4Im',
};

// Clean helper to remove undefined fields before writing to Firestore
function cleanForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

interface AppContextType {
  dishes: MenuItem[];
  settings: AppSettings;
  tiktokVideos: TikTokVideoItem[];
  isAdminRoute: boolean;
  setIsAdminRoute: (val: boolean) => void;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  addDish: (dish: Omit<MenuItem, 'id'>) => MenuItem;
  updateDish: (id: string, updated: Partial<MenuItem>) => void;
  deleteDish: (id: string) => void;
  clearAllDishes: () => void;
  importSampleDishes: () => { imported: number; skipped: number };
  addTikTokVideo: (video: { url: string; videoId: string; caption?: string; coverUrl?: string }) => boolean;
  deleteTikTokVideo: (id: string) => void;
  moveTikTokVideo: (id: string, direction: 'up' | 'down') => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  restoreDefaultLogo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Dishes State with local cache fallback
  const [dishes, setDishes] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem('maestro_dishes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error loading cached dishes:', e);
    }
    return MENU_ITEMS;
  });

  // 2. Settings State with local cache fallback
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('maestro_settings');
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Error loading cached settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // 3. TikTok Videos State with local cache fallback
  const [tiktokVideos, setTiktokVideos] = useState<TikTokVideoItem[]>(() => {
    try {
      const stored = localStorage.getItem('maestro_tiktok_videos');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error loading cached TikTok videos:', e);
    }
    return [];
  });

  // 4. Admin Navigation & Auth State
  const [isAdminRoute, setIsAdminRouteState] = useState<boolean>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('maestro_admin_auth') === 'true';
  });

  // Real-time Firestore sync for Dishes
  useEffect(() => {
    const dishesRef = collection(db, 'dishes');
    const unsubscribe = onSnapshot(
      dishesRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: MenuItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push(docSnap.data() as MenuItem);
          });
          // Sort items by createdAt descending (newest first)
          items.sort((a, b) => {
            const timeA = typeof a.createdAt === 'number' ? a.createdAt : 0;
            const timeB = typeof b.createdAt === 'number' ? b.createdAt : 0;
            return timeB - timeA;
          });
          setDishes(items);
          try {
            localStorage.setItem('maestro_dishes', JSON.stringify(items));
          } catch (e) {
            console.warn('Failed saving dishes to localStorage cache:', e);
          }
        } else {
          // If Firestore dishes collection is empty, seed initial menu into Firestore
          const batch = writeBatch(db);
          MENU_ITEMS.forEach((item) => {
            const docRef = doc(db, 'dishes', item.id);
            batch.set(docRef, cleanForFirestore({ ...item, createdAt: Date.now() }));
          });
          batch
            .commit()
            .then(() => {
              setDishes(MENU_ITEMS);
            })
            .catch((err) => {
              console.warn('Initial dishes seed to Firestore failed:', err);
            });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'dishes');
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Settings
  useEffect(() => {
    const settingsDocRef = doc(db, 'settings', 'general');
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudSettings = { ...DEFAULT_SETTINGS, ...docSnap.data() } as AppSettings;
          setSettings(cloudSettings);
          try {
            localStorage.setItem('maestro_settings', JSON.stringify(cloudSettings));
          } catch (e) {
            console.warn('Failed saving settings to localStorage cache:', e);
          }
        } else {
          // Seed default settings into Firestore
          setDoc(settingsDocRef, cleanForFirestore(DEFAULT_SETTINGS)).catch((err) => {
            console.warn('Settings seed error:', err);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/general');
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for TikTok Videos
  useEffect(() => {
    const tiktokRef = collection(db, 'tiktok_videos');
    const unsubscribe = onSnapshot(
      tiktokRef,
      (snapshot) => {
        const vids: TikTokVideoItem[] = [];
        snapshot.forEach((docSnap) => {
          vids.push(docSnap.data() as TikTokVideoItem);
        });
        vids.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setTiktokVideos(vids);
        try {
          localStorage.setItem('maestro_tiktok_videos', JSON.stringify(vids));
        } catch (e) {
          console.warn('Failed saving tiktok videos to localStorage cache:', e);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'tiktok_videos');
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync route with browser popstate
  useEffect(() => {
    const checkRoute = () => {
      const isAdm = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setIsAdminRouteState(isAdm);
    };

    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  const setIsAdminRoute = (val: boolean) => {
    setIsAdminRouteState(val);
    if (val) {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        window.history.pushState(null, '', '/');
      }
    }
  };

  // Auth Methods
  const login = (enteredPin: string): boolean => {
    if (enteredPin === settings.pin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('maestro_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('maestro_admin_auth');
  };

  // Dishes Methods connected to Firestore
  const addDish = (dishData: Omit<MenuItem, 'id'>): MenuItem => {
    const uniqueId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `dish-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newDish: MenuItem = {
      ...dishData,
      id: uniqueId,
      createdAt: dishData.createdAt || Date.now(),
    };

    // Optimistic local state update
    setDishes((prev) => [newDish, ...prev]);

    // Persist to Cloud Firestore
    const cleanData = cleanForFirestore(newDish);
    setDoc(doc(db, 'dishes', uniqueId), cleanData).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `dishes/${uniqueId}`);
    });

    return newDish;
  };

  const updateDish = (id: string, updated: Partial<MenuItem>) => {
    // Optimistic local update
    setDishes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
    );

    // Persist to Cloud Firestore
    const cleanData = cleanForFirestore(updated);
    setDoc(doc(db, 'dishes', id), cleanData, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `dishes/${id}`);
    });
  };

  const deleteDish = (id: string) => {
    // Optimistic local update
    setDishes((prev) => prev.filter((d) => d.id !== id));

    // Delete in Cloud Firestore
    deleteDoc(doc(db, 'dishes', id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `dishes/${id}`);
    });
  };

  const clearAllDishes = () => {
    setDishes([]);
    // Delete in Cloud Firestore
    getDocs(collection(db, 'dishes'))
      .then((snapshot) => {
        const batch = writeBatch(db);
        snapshot.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        return batch.commit();
      })
      .catch((err) => {
        handleFirestoreError(err, OperationType.DELETE, 'dishes');
      });
  };

  const importSampleDishes = (): { imported: number; skipped: number } => {
    let imported = 0;
    let skipped = 0;

    const existingNames = new Set(
      dishes.map((d) => d.nameFr.toLowerCase().trim())
    );

    const toAdd: MenuItem[] = [];
    const batch = writeBatch(db);

    for (const sample of MENU_ITEMS) {
      const normalized = sample.nameFr.toLowerCase().trim();
      if (existingNames.has(normalized)) {
        skipped++;
      } else {
        const dishWithTimestamp: MenuItem = {
          ...sample,
          createdAt: Date.now() - toAdd.length * 1000,
        };
        toAdd.push(dishWithTimestamp);
        existingNames.add(normalized);
        imported++;

        const docRef = doc(db, 'dishes', sample.id);
        batch.set(docRef, cleanForFirestore(dishWithTimestamp));
      }
    }

    if (toAdd.length > 0) {
      setDishes((prev) => [...toAdd, ...prev]);
      batch.commit().catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, 'dishes');
      });
    }

    return { imported, skipped };
  };

  // TikTok Methods connected to Firestore
  const addTikTokVideo = (videoData: {
    url: string;
    videoId: string;
    caption?: string;
    coverUrl?: string;
  }): boolean => {
    if (tiktokVideos.length >= 6) return false;
    const newId = `tt-${Date.now()}`;
    const newVideo: TikTokVideoItem = {
      ...videoData,
      id: newId,
      createdAt: Date.now(),
    };

    setTiktokVideos((prev) => [...prev, newVideo]);

    setDoc(doc(db, 'tiktok_videos', newId), cleanForFirestore(newVideo)).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `tiktok_videos/${newId}`);
    });

    return true;
  };

  const deleteTikTokVideo = (id: string) => {
    setTiktokVideos((prev) => prev.filter((v) => v.id !== id));
    deleteDoc(doc(db, 'tiktok_videos', id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `tiktok_videos/${id}`);
    });
  };

  const moveTikTokVideo = (id: string, direction: 'up' | 'down') => {
    setTiktokVideos((prev) => {
      const idx = prev.findIndex((v) => v.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  // Settings Methods connected to Firestore
  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    setDoc(doc(db, 'settings', 'general'), cleanForFirestore(partial), { merge: true }).catch(
      (err) => {
        handleFirestoreError(err, OperationType.UPDATE, 'settings/general');
      }
    );
  };

  const restoreDefaultLogo = () => {
    setSettings((prev) => ({ ...prev, logoUrl: null }));
    setDoc(doc(db, 'settings', 'general'), { logoUrl: null }, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/general');
    });
  };

  return (
    <AppContext.Provider
      value={{
        dishes,
        settings,
        tiktokVideos,
        isAdminRoute,
        setIsAdminRoute,
        isAuthenticated,
        login,
        logout,
        addDish,
        updateDish,
        deleteDish,
        clearAllDishes,
        importSampleDishes,
        addTikTokVideo,
        deleteTikTokVideo,
        moveTikTokVideo,
        updateSettings,
        restoreDefaultLogo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
