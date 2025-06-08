import React from 'react';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import App from './App';

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
});
