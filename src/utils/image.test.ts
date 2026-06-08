import { describe, expect, it, vi } from 'vitest';
import { MAX_IMAGE_SIZE_BYTES } from '../constants/image';
import { fileToBase64, validateImageFile } from './image';

describe('validateImageFile', () => {
  it('accepts png and jpeg files within the size limit', () => {
    const pngFile = new File(['x'], 'photo.png', { type: 'image/png' });
    const jpegFile = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });

    expect(validateImageFile(pngFile)).toBeNull();
    expect(validateImageFile(jpegFile)).toBeNull();
  });

  it('rejects unsupported file types', () => {
    const gifFile = new File(['x'], 'photo.gif', { type: 'image/gif' });

    expect(validateImageFile(gifFile)).toBe('Image must be a PNG or JPEG file');
  });

  it('rejects files larger than the limit', () => {
    const largeFile = new File(
      [new Uint8Array(MAX_IMAGE_SIZE_BYTES + 1)],
      'large.png',
      { type: 'image/png' }
    );

    expect(validateImageFile(largeFile)).toBe('Image must be 5 MB or smaller');
  });
});

describe('fileToBase64', () => {
  it('converts a file to a base64 data url', async () => {
    class MockFileReader {
      result: string | ArrayBuffer | null = 'data:image/png;base64,dGVzdA==';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      readAsDataURL() {
        this.onload?.();
      }
    }

    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File(['test'], 'photo.png', { type: 'image/png' });
    await expect(fileToBase64(file)).resolves.toBe(
      'data:image/png;base64,dGVzdA=='
    );

    vi.unstubAllGlobals();
  });
});
