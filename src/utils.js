/**
 * Utility functions for the S3 uploader application
 */

/**
 * Generates a path for storing files in S3 based on user ID and folder type
 * @param {string} userId - The ID of the user
 * @param {string} folderType - The type of folder ('input' or 'output')
 * @param {string} fileName - The name of the file
 * @returns {string} - The full path for the file in S3
 */
export const generateUserPath = (userId, folderType, fileName) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (!['input', 'output'].includes(folderType)) {
    throw new Error('Folder type must be either "input" or "output"');
  }
  
  return `${userId}/${folderType}/${fileName}`;
};

/**
 * Formats file size in bytes to a human-readable format
 * @param {number} bytes - The size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {number} k - The base unit (default: 1024 for binary)
 * @returns {string} - Formatted size with unit
 */
export const formatBytes = (bytes, decimals = 2, k = 1024) => {
  if (bytes === 0) return "0 Bytes";
  
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 * Extracts the filename from a full S3 path
 * @param {string} path - The full S3 path
 * @returns {string} - The filename
 */
export const extractFilenameFromPath = (path) => {
  if (!path) return '';
  const parts = path.split('/');
  return parts[parts.length - 1];
};

/**
 * Determines if a path belongs to a specific user
 * @param {string} path - The full S3 path
 * @param {string} userId - The user ID to check against
 * @returns {boolean} - True if the path belongs to the user
 */
export const isUserPath = (path, userId) => {
  if (!path || !userId) return false;
  return path.startsWith(`${userId}/`);
};