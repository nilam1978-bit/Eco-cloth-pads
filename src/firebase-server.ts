import { initializeApp, cert, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

/**
 * Password security helpers.
 * All admin passwords are hashed with bcrypt before being stored anywhere
 * (local JSON file or Firestore). Plain-text passwords are never persisted.
 */

// Detects an existing bcrypt hash (format: $2a$10$..., $2b$10$..., etc.)
export function isBcryptHash(value: unknown): boolean {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

// Hashes a plain-text password for storage
export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

// Verifies a plain-text password against whatever is stored.
// Supports bcrypt hashes (current/normal case) and falls back to a direct
// string comparison for any legacy plain-text password that hasn't been
// re-saved yet (it will get hashed automatically the next time settings are saved).
export function verifyPassword(plainInput: string | undefined | null, stored: string | undefined | null): boolean {
  if (!plainInput || !stored) return false;
  if (isBcryptHash(stored)) {
    try {
      return bcrypt.compareSync(plainInput, stored);
    } catch {
      return false;
    }
  }
  return plainInput === stored;
}

const getDirname = () => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (e) {
    return __dirname;
  }
};

const getLocalDbPath = () => path.join(getDirname(), 'customizer-db.json');

// Keys representing our logical tables/documents in Firestore
const DB_KEYS = [
  'fabricsTop',
  'fabricsBacking',
  'sizeOptions',
  'absorbencyOptions',
  'readyMadeStocks',
  'shapeOptions',
  'washingFaq',
  'blogPosts',
  'settings'
];

let dbInstance: Firestore | null = null;
let isFirebaseInitialized = false;

/**
 * Safely initializes the Firebase Admin SDK on first call
 */
export function getFirestoreInstance(): Firestore | null {
  if (isFirebaseInitialized) {
    return dbInstance;
  }

  isFirebaseInitialized = true;

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT;
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERIVCE_ACCOUNT_KEY;
    const databaseId = process.env.FIREBASE_DATABASE_ID || process.env.FIRESTORE_DATABASE_ID;

    const apps = getApps();
    let app;
    if (apps.length > 0) {
      console.log('Firebase Admin SDK already initialized. Using existing app instance.');
      app = apps[0];
    } else {
      if (serviceAccountKey) {
        let serviceAccount;
        try {
          serviceAccount = JSON.parse(serviceAccountKey);
        } catch (e: any) {
          // If it's a base64 encoded string, decode it
          const decoded = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
          serviceAccount = JSON.parse(decoded);
        }
        
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: projectId || serviceAccount.project_id
        });
        console.log('Firebase Admin initialized with credentials from FIREBASE_SERVICE_ACCOUNT_KEY.');
      } else if (projectId) {
        app = initializeApp({
          projectId
        });
        console.log(`Firebase Admin initialized with project ID: ${projectId}`);
      } else {
        // Check if default credentials/GCP service account environment is available
        console.log('No specific Firebase environment variables found. Attempting default initialization...');
        app = initializeApp({
          credential: applicationDefault()
        });
        console.log('Firebase Admin initialized with Default Credentials.');
      }
    }

    if (app) {
      if (databaseId) {
        console.log(`Initializing Firestore with custom database ID: ${databaseId}`);
        dbInstance = getFirestore(app, databaseId);
      } else {
        dbInstance = getFirestore(app);
      }
    }
  } catch (err: any) {
    console.warn(
      'Firebase Admin failed to initialize. Falling back to local JSON database. Error:',
      err.message
    );
    dbInstance = null;
  }

  return dbInstance;
}

/**
 * Reads local fallback customizer-db.json
 */
export function readLocalDb(): any {
  const dbPath = getLocalDbPath();
  if (fs.existsSync(dbPath)) {
    try {
      const raw = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading local JSON file db:', e);
    }
  }
  return {};
}

/**
 * Writes local fallback customizer-db.json
 */
export function writeLocalDb(data: any): void {
  try {
    const dbPath = getLocalDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Local JSON file database updated successfully.');
  } catch (err) {
    console.error('Error writing local JSON file db:', err);
  }
}

/**
 * Performs a zero-downtime, automated migration to Firestore if empty
 */
async function autoMigrateIfEmpty(firestore: Firestore, localData: any): Promise<void> {
  try {
    const collRef = firestore.collection('customizer_data');
    
    // Check if settings doc already exists
    const settingsDoc = await collRef.doc('settings').get();
    if (settingsDoc.exists) {
      console.log('Firestore is already seeded. Skipping auto-migration.');
      return;
    }

    console.log('Firestore collection is empty. Beginning automated data migration from customizer-db.json...');
    const batch = firestore.batch();

    for (const key of DB_KEYS) {
      const docRef = collRef.doc(key);
      const val = localData[key];
      if (val !== undefined) {
        if (Array.isArray(val)) {
          batch.set(docRef, { items: val });
        } else {
          batch.set(docRef, val || {});
        }
      }
    }

    await batch.commit();
    console.log('Automated Firestore migration completed successfully!');
  } catch (err: any) {
    const isSetupError = err.message && (
      err.message.includes('NOT_FOUND') || 
      err.message.includes('5') || 
      err.message.toLowerCase().includes('database') ||
      err.message.includes('PERMISSION_DENIED')
    );
    if (isSetupError) {
      console.log('[Firebase Info] Automated Firestore migration skipped or deferred. Database is not fully provisioned/enabled in the Firebase Console yet.');
    } else {
      console.error('Automated Firestore migration failed:', err.message);
    }
  }
}

/**
 * Reads full database state, with zero-downtime Firestore read and automatic seeding
 */
export async function getDbData(): Promise<any> {
  const localData = readLocalDb();
  const firestore = getFirestoreInstance();

  if (!firestore) {
    console.log('Using local JSON database (Firebase Admin not connected).');
    return localData;
  }

  try {
    const collRef = firestore.collection('customizer_data');
    
    // First, verify and perform migration if Firestore is newly provisioned
    await autoMigrateIfEmpty(firestore, localData);

    // Fetch all 8 documents in parallel
    const docPromises = DB_KEYS.map((key) => collRef.doc(key).get());
    const snapshots = await Promise.all(docPromises);

    const result: any = {};
    for (let i = 0; i < DB_KEYS.length; i++) {
      const key = DB_KEYS[i];
      const snap = snapshots[i];

      if (snap.exists) {
        const data = snap.data() || {};
        const isArrayKey = key !== 'settings';
        if (isArrayKey) {
          // If the original data was an array, extract it from 'items'
          result[key] = data.items || [];
        } else {
          // If it was an object (e.g., settings)
          result[key] = data;
        }
      } else {
        // Fallback to local data if document doesn't exist
        const isArrayKey = key !== 'settings';
        result[key] = localData[key] || (isArrayKey ? [] : {});
      }
    }

    return result;
  } catch (err: any) {
    const isSetupError = err.message && (
      err.message.includes('NOT_FOUND') || 
      err.message.includes('5') || 
      err.message.toLowerCase().includes('database') ||
      err.message.includes('PERMISSION_DENIED')
    );
    if (isSetupError) {
      console.log('[Firebase Info] Firestore query deferred: Database not active in Firebase Console. Using customizer-db.json fallback database.');
    } else {
      console.warn('Failed to retrieve data from Firestore. Falling back to local database. Error:', err.message);
    }
    return localData;
  }
}

/**
 * Saves full database state to Firestore and updates local JSON file as backup
 */
export async function saveDbData(data: any): Promise<boolean> {
  // Hash the admin password before it ever touches disk or Firestore.
  // If it's already a bcrypt hash (unchanged from last save), leave it as-is.
  if (data?.settings?.adminPassword && !isBcryptHash(data.settings.adminPassword)) {
    data = {
      ...data,
      settings: {
        ...data.settings,
        adminPassword: hashPassword(data.settings.adminPassword)
      }
    };
  }

  // Always update the local JSON file as a reliable backup/fallback
  writeLocalDb(data);

  const firestore = getFirestoreInstance();
  if (!firestore) {
    console.log('Changes saved only to local JSON file (Firebase Admin not connected).');
    return true;
  }

  try {
    const collRef = firestore.collection('customizer_data');
    const batch = firestore.batch();

    for (const key of DB_KEYS) {
      const docRef = collRef.doc(key);
      const val = data[key];
      if (val !== undefined) {
        if (Array.isArray(val)) {
          batch.set(docRef, { items: val });
        } else {
          batch.set(docRef, val || {});
        }
      }
    }

    await batch.commit();
    console.log('Changes saved successfully to Firestore database!');
    return true;
  } catch (err: any) {
    const isSetupError = err.message && (
      err.message.includes('NOT_FOUND') || 
      err.message.includes('5') || 
      err.message.toLowerCase().includes('database') ||
      err.message.includes('PERMISSION_DENIED')
    );
    if (isSetupError) {
      console.log('[Firebase Info] Save to Firestore deferred: Database is not active in Firebase Console. Updated local customizer-db.json fallback backup.');
      return true; // Return true as we successfully saved to fallback localDb
    } else {
      console.error('Failed to save changes to Firestore database:', err.message);
      throw new Error(`Firestore save error: ${err.message}`);
    }
  }
}