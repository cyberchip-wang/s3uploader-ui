import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { Storage } from 'aws-amplify';

// Mock the AWS Amplify modules
jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn()
  },
  Auth: {
    signOut: jest.fn().mockResolvedValue({})
  },
  Storage: {
    put: jest.fn().mockResolvedValue({}),
    get: jest.fn(),
    list: jest.fn(),
    remove: jest.fn()
  }
}));

// Mock the aws-exports file
jest.mock('./aws-exports', () => ({}));

// Mock the Authenticator component
jest.mock('@aws-amplify/ui-react', () => ({
  Authenticator: ({ children }) => children({ 
    signOut: jest.fn(), 
    user: { username: 'testuser' } 
  })
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the application with navigation', () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );
    
    // Check if the navigation items are rendered
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Input Files')).toBeInTheDocument();
    expect(screen.getByText('Output Files')).toBeInTheDocument();
    
    // Check if the header is rendered
    expect(screen.getByText('Application')).toBeInTheDocument();
    expect(screen.getByText('Web application to upload files to S3')).toBeInTheDocument();
  });

  test('creates input and output folders on mount', async () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );
    
    // Wait for the useEffect to run
    await waitFor(() => {
      // Verify that Storage.put was called twice - once for input folder and once for output folder
      expect(Storage.put).toHaveBeenCalledTimes(2);
      
      // Check that the input folder was created
      expect(Storage.put).toHaveBeenCalledWith(
        'testuser/input/', 
        '', 
        { level: 'protected' }
      );
      
      // Check that the output folder was created
      expect(Storage.put).toHaveBeenCalledWith(
        'testuser/output/', 
        '', 
        { level: 'protected' }
      );
    });
  });

  test('shows error message when folder creation fails', async () => {
    // Mock Storage.put to fail
    Storage.put.mockRejectedValueOnce(new Error('Failed to create folder'));
    
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to create user folders. Some features may not work properly.')).toBeInTheDocument();
    });
  });
});
