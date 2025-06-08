import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import {
    Container,
    Header,
    Table,
    Box,
    SpaceBetween,
    Button,
    Spinner,
    Alert
} from "@cloudscape-design/components";
import { formatBytes, extractFilenameFromPath } from './utils';

/**
 * Component for displaying and managing files in a user's input or output folder
 */
const FileExplorer = ({ user, folderType }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    // Column definitions for the file table
    const columnDefinitions = [
        {
            id: 'name',
            header: 'File name',
            cell: item => extractFilenameFromPath(item.key),
            sortingField: 'name'
        },
        {
            id: 'lastModified',
            header: 'Last modified',
            cell: item => item.lastModified ? new Date(item.lastModified).toLocaleString() : '-',
            sortingField: 'lastModified'
        },
        {
            id: 'size',
            header: 'Size',
            cell: item => item.size ? formatBytes(item.size) : '-',
            sortingField: 'size'
        }
    ];

    // Load files when component mounts or when user/folderType changes
    useEffect(() => {
        if (!user) return;
        
        const loadFiles = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // List files in the user's folder
                const path = `${user.username}/${folderType}/`;
                const result = await Storage.list(path, { level: 'protected' });
                
                // Filter out the directory itself
                const fileList = result.results.filter(item => item.key !== path);
                setFiles(fileList);
            } catch (err) {
                console.error('Error loading files:', err);
                setError('Failed to load files. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        loadFiles();
    }, [user, folderType]);

    // Handle file download
    const handleDownload = async (item) => {
        try {
            const result = await Storage.get(item.key, { level: 'protected' });
            window.open(result, '_blank');
        } catch (err) {
            console.error('Error downloading file:', err);
            setError('Failed to download file. Please try again later.');
        }
    };

    // Handle file deletion
    const handleDelete = async (items) => {
        try {
            await Promise.all(items.map(item => Storage.remove(item.key, { level: 'protected' })));
            
            // Refresh the file list
            const path = `${user.username}/${folderType}/`;
            const result = await Storage.list(path, { level: 'protected' });
            const fileList = result.results.filter(item => item.key !== path);
            setFiles(fileList);
            
            // Clear selection
            setSelectedItems([]);
        } catch (err) {
            console.error('Error deleting files:', err);
            setError('Failed to delete files. Please try again later.');
        }
    };

    return (
        <Container
            header={
                <Header
                    variant="h2"
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button
                                disabled={selectedItems.length === 0}
                                onClick={() => handleDownload(selectedItems[0])}
                            >
                                Download
                            </Button>
                            <Button
                                disabled={selectedItems.length === 0}
                                onClick={() => handleDelete(selectedItems)}
                            >
                                Delete
                            </Button>
                        </SpaceBetween>
                    }
                >
                    {folderType === 'input' ? 'Input Files' : 'Output Files'}
                </Header>
            }
        >
            {error && (
                <Alert type="error" dismissible onDismiss={() => setError(null)}>
                    {error}
                </Alert>
            )}
            
            {loading ? (
                <Box textAlign="center" padding="l">
                    <Spinner size="large" />
                </Box>
            ) : (
                <Table
                    columnDefinitions={columnDefinitions}
                    items={files}
                    selectionType="single"
                    selectedItems={selectedItems}
                    onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
                    empty={
                        <Box textAlign="center" color="inherit">
                            <b>No files</b>
                            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                                No files found in this folder.
                            </Box>
                        </Box>
                    }
                />
            )}
        </Container>
    );
};

export default FileExplorer;