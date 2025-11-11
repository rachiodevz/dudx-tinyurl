import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AVATAR_DIR = path.join(__dirname, '../../public/uploads/avatars');

// Ensure avatar directory exists
if (!fs.existsSync(AVATAR_DIR)) {
  fs.mkdirSync(AVATAR_DIR, { recursive: true });
}

/**
 * Download image from URL and save locally
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete partial file
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Generate default avatar with user initials
 * Creates a simple SVG avatar
 */
function generateDefaultAvatar(name, filepath) {
  // Get initials (first letter of first and last name)
  const initials = name
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Generate random color based on name
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const bgColor = colors[colorIndex];

  // Create SVG
  const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${bgColor}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="80" font-weight="bold"
        fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
</svg>`;

  fs.writeFileSync(filepath, svg);
  return filepath;
}

/**
 * Process and save user avatar
 * Downloads from Google if available, otherwise generates default
 */
export async function saveUserAvatar(googleId, photoUrl, name) {
  try {
    const filename = `${googleId}.jpg`;
    const filepath = path.join(AVATAR_DIR, filename);

    // Check if avatar already exists locally
    if (fs.existsSync(filepath)) {
      return `/uploads/avatars/${filename}`;
    }

    // Try to download from Google
    if (photoUrl) {
      try {
        await downloadImage(photoUrl, filepath);
        console.log(`✅ Downloaded avatar for ${name}`);
        return `/uploads/avatars/${filename}`;
      } catch (downloadError) {
        console.warn(`⚠️  Failed to download avatar for ${name}, generating default...`);
      }
    }

    // Generate default avatar if download failed or no photo URL
    const svgFilename = `${googleId}.svg`;
    const svgFilepath = path.join(AVATAR_DIR, svgFilename);
    generateDefaultAvatar(name, svgFilepath);
    console.log(`✅ Generated default avatar for ${name}`);
    return `/uploads/avatars/${svgFilename}`;

  } catch (error) {
    console.error(`❌ Error processing avatar for ${name}:`, error);
    // Return null and let frontend handle with CSS
    return null;
  }
}

/**
 * Get user avatar path (local if exists, otherwise Google URL or null)
 */
export function getUserAvatar(googleId, googlePhotoUrl) {
  const jpgPath = path.join(AVATAR_DIR, `${googleId}.jpg`);
  const svgPath = path.join(AVATAR_DIR, `${googleId}.svg`);

  if (fs.existsSync(jpgPath)) {
    return `/uploads/avatars/${googleId}.jpg`;
  }
  if (fs.existsSync(svgPath)) {
    return `/uploads/avatars/${googleId}.svg`;
  }

  // Return Google URL as fallback
  return googlePhotoUrl || null;
}

/**
 * Delete user avatar
 */
export function deleteUserAvatar(googleId) {
  const jpgPath = path.join(AVATAR_DIR, `${googleId}.jpg`);
  const svgPath = path.join(AVATAR_DIR, `${googleId}.svg`);

  if (fs.existsSync(jpgPath)) {
    fs.unlinkSync(jpgPath);
  }
  if (fs.existsSync(svgPath)) {
    fs.unlinkSync(svgPath);
  }
}
