import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

if (typeof DataTransfer === 'undefined') {
  class DataTransferPolyfill {
    private readonly fileList: File[];

    constructor() {
      this.fileList = [];
    }

    get files(): FileList {
      const files = this.fileList;

      return {
        length: files.length,
        item: (index: number) => files[index] ?? null,
        *[Symbol.iterator]() {
          for (const file of files) {
            yield file;
          }
        },
      } as FileList;
    }
  }

  globalThis.DataTransfer = DataTransferPolyfill as typeof DataTransfer;
}
