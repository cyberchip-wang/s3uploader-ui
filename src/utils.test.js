import { generateUserPath, formatBytes, extractFilenameFromPath, isUserPath } from './utils';

describe('Utils', () => {
  describe('generateUserPath', () => {
    it('should generate correct path for input folder', () => {
      const result = generateUserPath('user123', 'input', 'file.txt');
      expect(result).toBe('user123/input/file.txt');
    });

    it('should generate correct path for output folder', () => {
      const result = generateUserPath('user123', 'output', 'file.txt');
      expect(result).toBe('user123/output/file.txt');
    });

    it('should throw error if userId is not provided', () => {
      expect(() => generateUserPath(null, 'input', 'file.txt')).toThrow('User ID is required');
    });

    it('should throw error if folderType is invalid', () => {
      expect(() => generateUserPath('user123', 'invalid', 'file.txt')).toThrow('Folder type must be either "input" or "output"');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1073741824)).toBe('1 GB');
    });

    it('should respect decimal places', () => {
      expect(formatBytes(1536, 1)).toBe('1.5 KB');
      expect(formatBytes(1536, 0)).toBe('2 KB');
    });
  });

  describe('extractFilenameFromPath', () => {
    it('should extract filename from path', () => {
      expect(extractFilenameFromPath('user123/input/file.txt')).toBe('file.txt');
      expect(extractFilenameFromPath('file.txt')).toBe('file.txt');
    });

    it('should handle empty path', () => {
      expect(extractFilenameFromPath('')).toBe('');
      expect(extractFilenameFromPath(null)).toBe('');
    });
  });

  describe('isUserPath', () => {
    it('should return true for paths belonging to user', () => {
      expect(isUserPath('user123/input/file.txt', 'user123')).toBe(true);
      expect(isUserPath('user123/output/file.txt', 'user123')).toBe(true);
    });

    it('should return false for paths not belonging to user', () => {
      expect(isUserPath('user456/input/file.txt', 'user123')).toBe(false);
    });

    it('should handle empty inputs', () => {
      expect(isUserPath('', 'user123')).toBe(false);
      expect(isUserPath('user123/input/file.txt', '')).toBe(false);
      expect(isUserPath(null, 'user123')).toBe(false);
      expect(isUserPath('user123/input/file.txt', null)).toBe(false);
    });
  });
});