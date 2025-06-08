import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FileExplorer from './FileExplorer';
import { Storage } from 'aws-amplify';

// Mock the AWS Amplify Storage module
jest.mock('aws-amplify', () => ({
  Storage: {
    list: jest.fn(),
    get: jest.fn(),
    remove: jest.fn()
  }
}));

describe('FileExplorer', () => {
  const mockUser = { username: 'testuser' };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading state initially', () => {
    // Mock the Storage.list to return a promise that never resolves
    Storage.list.mockImplementation(() => new Promise(() => {}));
    
    render(<FileExplorer user={mockUser} folderType="input" />);
    
    // Check if loading spinner is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display files when loaded', async () => {
    // Mock the Storage.list to return some files
    Storage.list.mockResolvedValue({
      results: [
        { key: 'testuser/input/file1.txt', lastModified: new Date(), size: 1024 },
        { key: 'testuser/input/file2.txt', lastModified: new Date(), size: 2048 }
      ]
    });
    
    render(<FileExplorer user={mockUser} folderType="input" />);
    
    // Wait for the files to load
    await waitFor(() => {
      expect(screen.getByText('file1.txt')).toBeInTheDocument();
      expect(screen.getByText('file2.txt')).toBeInTheDocument();
    });
    
    // Check if the Storage.list was called with the correct parameters
    expect(Storage.list).toHaveBeenCalledWith('testuser/input/', { level: 'protected' });
  });

  it('should display empty state when no files are found', async () => {
    // Mock the Storage.list to return no files
    Storage.list.mockResolvedValue({
      results: []
    });
    
    render(<FileExplorer user={mockUser} folderType="output" />);
    
    // Wait for the files to load
    await waitFor(() => {
      expect(screen.getByText('No files')).toBeInTheDocument();
    });
    
    // Check if the Storage.list was called with the correct parameters
    expect(Storage.list).toHaveBeenCalledWith('testuser/output/', { level: 'protected' });
  });

  it('should display error message when loading fails', async () => {
    // Mock the Storage.list to throw an error
    Storage.list.mockRejectedValue(new Error('Failed to load files'));
    
    render(<FileExplorer user={mockUser} folderType="input" />);
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load files. Please try again later.')).toBeInTheDocument();
    });
  });
});