/**
 * QR Code Generator with DUDX Branding
 * Generates QR codes with logo/text overlay
 */

import QRCode from 'qrcode';
import { createCanvas, loadImage, registerFont } from 'canvas';

/**
 * Generate QR code with DUDX branding
 * @param {string} url - URL to encode in QR code
 * @param {Object} options - Generation options
 * @returns {Promise<string>} Base64 data URL of the QR code image
 */
export async function generateBrandedQRCode(url, options = {}) {
  const {
    size = 400,
    margin = 40,
    logoText = 'DUDX',
    includeUrl = true,
  } = options;

  try {
    // Generate base QR code
    const qrCanvas = createCanvas(size, size);
    await QRCode.toCanvas(qrCanvas, url, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction for logo overlay
    });

    // Create final canvas with margin and branding
    const finalSize = size + (margin * 2);
    const canvas = createCanvas(finalSize, finalSize + 60); // Extra space for text
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR code
    ctx.drawImage(qrCanvas, margin, margin);

    // Add DUDX logo/text in center
    const centerX = finalSize / 2;
    const centerY = finalSize / 2;
    const logoSize = size * 0.15; // 15% of QR code size

    // White circle background for logo
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize, 0, Math.PI * 2);
    ctx.fill();

    // Add border to logo circle
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize, 0, Math.PI * 2);
    ctx.stroke();

    // Add DUDX text in circle
    ctx.fillStyle = '#667eea';
    ctx.font = `bold ${logoSize * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(logoText, centerX, centerY);

    // Add URL below QR code (if enabled)
    if (includeUrl) {
      ctx.fillStyle = '#333333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Truncate URL if too long
      const maxUrlLength = 50;
      const displayUrl = url.length > maxUrlLength
        ? url.substring(0, maxUrlLength) + '...'
        : url;

      ctx.fillText(displayUrl, finalSize / 2, finalSize + 10);
    }

    // Add "Powered by DUDX" at bottom
    ctx.fillStyle = '#999999';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Powered by DUDX', finalSize / 2, finalSize + 40);

    // Convert to base64 data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to generate branded QR code:', error);

    // Fallback to simple QR code without branding
    return await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
  }
}

/**
 * Generate simple QR code without branding (faster)
 * @param {string} url - URL to encode
 * @param {number} size - QR code size
 * @returns {Promise<string>} Base64 data URL
 */
export async function generateSimpleQRCode(url, size = 300) {
  return await QRCode.toDataURL(url, {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'M',
  });
}

export default {
  generateBrandedQRCode,
  generateSimpleQRCode,
};
