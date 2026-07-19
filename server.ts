import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getDbData, saveDbData, verifyPassword } from './src/firebase-server.js';

dotenv.config({ override: true });

const getDirname = () => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (e) {
    return __dirname;
  }
};

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS natively
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Default fallback Admin Password
const DEFAULT_PASSWORD = 'wonderpads2026';

// API: Get DB
app.get('/api/db', async (req, res) => {
  try {
    const db = await getDbData();
    // Never send the admin password (hashed or not) to the browser.
    // The client doesn't need it - it only ever uses the password the
    // person actually types in during login.
    const safeDb = {
      ...db,
      settings: db.settings ? { ...db.settings, adminPassword: undefined } : db.settings
    };
    res.json(safeDb);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API: Firebase Connection Status
app.get('/api/firebase-status', async (req, res) => {
  try {
    const { getFirestoreInstance } = await import('./src/firebase-server.js');
    const firestore = getFirestoreInstance();
    const hasProjectID = !!(process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT);
    const hasServiceAccountKey = !!(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERIVCE_ACCOUNT_KEY);

    if (!firestore) {
      res.json({
        connected: false,
        fallback: 'Using local customizer-db.json fallback database. (FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID environment variables might not be loaded yet)',
        envDetected: {
          FIREBASE_PROJECT_ID: hasProjectID,
          FIREBASE_SERVICE_ACCOUNT_KEY: hasServiceAccountKey
        }
      });
      return;
    }
    
    // Test a lightweight query to confirm read permissions
    const collRef = firestore.collection('customizer_data');
    await collRef.limit(1).get();
    
    res.json({
      connected: true,
      mode: 'Firebase Cloud Firestore is ACTIVE and online',
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT || '(initialized via credentials)',
      envDetected: {
        FIREBASE_PROJECT_ID: hasProjectID,
        FIREBASE_SERVICE_ACCOUNT_KEY: hasServiceAccountKey
      }
    });
  } catch (err: any) {
    const hasProjectID = !!(process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT);
    const hasServiceAccountKey = !!(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERIVCE_ACCOUNT_KEY);
    
    let explanation = 'Firebase initialized but the operation failed. This often happens if the Cloud Firestore API is disabled or permissions/service-account-keys are incorrect.';
    if (err.message && (err.message.includes('NOT_FOUND') || err.message.includes('5') || err.message.toLowerCase().includes('database'))) {
      explanation = 'A "5 NOT_FOUND" error means that the Firestore database does not exist in your Firebase project "wonderpads-store", or it was created with a custom Database ID instead of the standard "(default)" database. To fix this, please open your Firebase Console for project "wonderpads-store" (under Build > Firestore Database) and verify if a database has been created. If no database exists, click "Create database" and choose the "(default)" database ID in "Start in test mode". If you purposely created a database with a custom ID, add a new setting/environment variable named "FIREBASE_DATABASE_ID" set to that custom ID.';
    }

    res.json({
      connected: false,
      error: err.message,
      explanation: explanation,
      envDetected: {
        FIREBASE_PROJECT_ID: hasProjectID,
        FIREBASE_SERVICE_ACCOUNT_KEY: hasServiceAccountKey
      }
    });
  }
});

// API: Save DB
app.post('/api/db', async (req, res) => {
  const adminPasswordHeader = req.headers['x-admin-password'] as string | undefined;
  const db = await getDbData();
  const currentPassword = db.settings?.adminPassword || DEFAULT_PASSWORD;

  if (!verifyPassword(adminPasswordHeader, currentPassword)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const body = req.body;
    await saveDbData(body);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error saving database:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    const db = await getDbData();
    const currentPassword = db.settings?.adminPassword || DEFAULT_PASSWORD;
    if (verifyPassword(password, currentPassword)) {
      res.json({ success: true });
      return;
    }
    res.status(401).json({ success: false, error: 'Invalid password' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

let s3Client: S3Client | null = null;
let cachedAccessKeyId: string | undefined = undefined;
let cachedSecretAccessKey: string | undefined = undefined;

function getS3Client() {
  const bucketName = process.env.R2_BUCKET_NAME;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT;

  if (!bucketName || !accessKeyId || !secretAccessKey || !endpoint) {
    console.log('R2 client initialization skipped: missing environment variables');
    return null;
  }

  // If credentials changed or client not created yet, instantiate new S3Client
  if (!s3Client || cachedAccessKeyId !== accessKeyId || cachedSecretAccessKey !== secretAccessKey) {
    console.log('Initializing S3Client for R2 storage:');
    console.log('- Endpoint:', endpoint);
    console.log('- Bucket Name:', bucketName);
    console.log('- Access Key ID starts with:', accessKeyId.substring(0, 4));
    console.log('- Secret Key starts with:', secretAccessKey.substring(0, 4));

    s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    cachedAccessKeyId = accessKeyId;
    cachedSecretAccessKey = secretAccessKey;
  }
  return s3Client;
}

// API: Media R2 Photos List
app.get('/api/media/photos', async (req, res) => {
  const bucketName = process.env.R2_BUCKET_NAME;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const publicUrl = process.env.R2_PUBLIC_URL;
  const endpoint = process.env.R2_ENDPOINT;

  const missingVars = [];
  if (!bucketName) missingVars.push('R2_BUCKET_NAME');
  if (!accessKeyId) missingVars.push('R2_ACCESS_KEY_ID');
  if (!secretAccessKey) missingVars.push('R2_SECRET_ACCESS_KEY');
  if (!publicUrl) missingVars.push('R2_PUBLIC_URL');
  if (!endpoint) missingVars.push('R2_ENDPOINT');

  const s3 = getS3Client();

  if (missingVars.length > 0 || !s3) {
    res.json({
      photos: [
        {
          public_id: 'sample_print_1',
          secure_url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=400&auto=format&fit=crop&q=60',
          filename: 'Pastel Florals.png',
          created_at: new Date().toISOString()
        },
        {
          public_id: 'sample_print_2',
          secure_url: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=400&auto=format&fit=crop&q=60',
          filename: 'Golden Honeycomb.png',
          created_at: new Date().toISOString()
        },
        {
          public_id: 'sample_print_3',
          secure_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=60',
          filename: 'Forest Vines.png',
          created_at: new Date().toISOString()
        }
      ],
      isMock: true,
      missingVars
    });
    return;
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'wpfabrics/',
    });
    const response = await s3.send(command);
    const cleanPublicUrl = publicUrl!.endsWith('/') ? publicUrl! : `${publicUrl!}/`;
    
    const photos = (response.Contents || []).map((item) => {
      const secure_url = `${cleanPublicUrl}${item.Key}`;
      const filename = item.Key!.split('/').pop() || item.Key!;
      return {
        public_id: item.Key!,
        secure_url,
        filename,
        created_at: item.LastModified ? item.LastModified.toISOString() : new Date().toISOString()
      };
    });

    res.json({
      photos,
      isMock: false,
      missingVars: []
    });
  } catch (err: any) {
    console.error('Error listing R2 bucket objects:', err);
    res.json({
      photos: [],
      isMock: false,
      error: err.message,
      missingVars: []
    });
  }
});

// API: Media R2 Upload
app.post('/api/media/upload', async (req, res) => {
  const adminPasswordHeader = req.headers['x-admin-password'] as string | undefined;
  const db = await getDbData();
  const currentPassword = db.settings?.adminPassword || DEFAULT_PASSWORD;

  if (!verifyPassword(adminPasswordHeader, currentPassword)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { image } = req.body;
    if (!image) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    const s3 = getS3Client();
    if (!s3) {
      res.json({
        photo: {
          secure_url: image || 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=400&auto=format&fit=crop&q=60',
        }
      });
      return;
    }

    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      res.status(400).json({ error: 'Invalid base64 image format' });
      return;
    }

    const contentType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const extension = contentType.split('/')[1] || 'png';
    const filename = `rts-fabric-${Date.now()}.${extension}`;
    const key = `wpfabrics/${filename}`;

    const bucketName = process.env.R2_BUCKET_NAME!;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3.send(command);

    const publicUrl = process.env.R2_PUBLIC_URL!;
    const cleanPublicUrl = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`;
    const secure_url = `${cleanPublicUrl}${key}`;

    res.json({
      photo: {
        secure_url,
      }
    });
  } catch (err: any) {
    console.error('R2 Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: GitHub Publish
app.post('/api/github/publish', async (req, res) => {
  const adminPasswordHeader = req.headers['x-admin-password'] as string | undefined;
  const db = await getDbData();
  const currentPassword = db.settings?.adminPassword || DEFAULT_PASSWORD;

  if (!verifyPassword(adminPasswordHeader, currentPassword)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // The GitHub token now lives only as a server secret (GITHUB_PAT) - it is
  // never sent from or stored in the browser.
  const githubToken = process.env.GITHUB_PAT;
  if (!githubToken) {
    res.status(500).json({
      error: 'GITHUB_PAT is not configured on the server. Add it as a secret/environment variable to enable GitHub publishing.'
    });
    return;
  }

  try {
    const { owner, repo, branch, commitMessage } = req.body;
    const dbContent = JSON.stringify(db, null, 2);
    const base64Content = Buffer.from(dbContent).toString('base64');
    const pathInRepo = 'src/customizer-db.json';

    let sha = '';
    try {
      const getFileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}?ref=${branch}`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'wonder-pads-server'
        }
      });
      if (getFileRes.ok) {
        const fileData: any = await getFileRes.json();
        sha = fileData.sha;
      }
    } catch (e) {
      console.log('No existing file found in repo or error fetching SHA', e);
    }

    const writeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'wonder-pads-server'
      },
      body: JSON.stringify({
        message: commitMessage || 'Update customizer-db.json from Wonder Pads Back Office',
        content: base64Content,
        branch,
        sha: sha || undefined
      })
    });

    if (!writeRes.ok) {
      const errText = await writeRes.text();
      throw new Error(`GitHub API responded with error: ${errText}`);
    }

    const writeData: any = await writeRes.json();
    res.json({
      success: true,
      commitSha: writeData.commit.sha
    });

  } catch (err: any) {
    console.error('GitHub Sync Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: AI Hygiene Care Advisor Chat (Streaming)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemInstruction, temperature } = req.body;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    if (!geminiApiKey) {
      res.write("Welcome to Wonder Pads! It looks like the Gemini API Key is not configured yet. Please configure GEMINI_API_KEY in Settings > Secrets to enable our live custom AI Care Advisor.");
      res.end();
      return;
    }

    const ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const contents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: temperature ?? 0.7
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();

  } catch (err: any) {
    console.error('Chat error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    } else {
      res.write(`\nError: ${err.message}`);
      res.end();
    }
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve frontend static files
    app.use(express.static(path.join(getDirname(), 'dist')));

    // For SPA routing, serve index.html for any remaining routes
    app.get('*', (req, res) => {
      const indexPath = path.join(getDirname(), 'dist', 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Not found');
      }
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}...`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});