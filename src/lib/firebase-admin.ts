import * as admin from 'firebase-admin';

function initializeFirebaseAdmin() {
  if (admin.apps.length) {
    return admin.apps[0]!;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin: Missing credentials, skipping initialization.');
    return null;
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    return null;
  }
}

const app = initializeFirebaseAdmin();

export const adminDb = app ? admin.firestore() : null;
export const adminStorage = app ? admin.storage() : null;
export const adminAuth = app ? admin.auth() : null;
