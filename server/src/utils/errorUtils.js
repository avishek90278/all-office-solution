exports.normalizeError = (error) => {
    console.error('Raw Error:', error);

    if (error.code === 'ENOENT') {
        return { message: 'File not found or inaccessible.', status: 404 };
    }

    if (error.message.includes('password')) {
        return { message: 'Incorrect password or encrypted file.', status: 401 };
    }

    if (error.message.includes('corrupt') || error.message.includes('Invalid PDF')) {
        return { message: 'The PDF file appears to be corrupted.', status: 400 };
    }

    // Default generic error
    return {
        message: error.message || 'An internal server error occurred.',
        status: error.status || 500
    };
};
