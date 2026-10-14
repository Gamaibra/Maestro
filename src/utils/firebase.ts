import { initializeApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

let cachedAuth: Auth | null = null;
export async function getFirebaseAuth(): Promise<Auth> {
  if (!cachedAuth) {
    const { getAuth } = await import('firebase/auth');
    cachedAuth = getAuth(app);
  }
  return cachedAuth;
}

export const auth = {
  get currentUser() {
    return cachedAuth?.currentUser || null;
  },
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: cachedAuth?.currentUser?.uid || null,
      email: cachedAuth?.currentUser?.email || null,
      emailVerified: cachedAuth?.currentUser?.emailVerified || null,
      isAnonymous: cachedAuth?.currentUser?.isAnonymous || null,
      tenantId: cachedAuth?.currentUser?.tenantId || null,
      providerInfo:
        cachedAuth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or configuration pending.');
    }
  }
}
testConnection();
