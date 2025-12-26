'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { FileDigit, Loader2 } from 'lucide-react';

export default function PageNumbersPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleAddNumbers = async () => {
        if (!file) return;
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('position', 'bottom-center');

        try {
            const response = await api.post('/page-numbers', formData);
            setDownloadUrl(`http://localhost:3001${response.data.downloadUrl}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4">Page Numbers</h1>
                {!downloadUrl ? (
                    <div className="space-y-8">
                        {!file ? (
                            <FileUpload files={[]} onFilesSelected={(f) => setFile(f[0])} onRemoveFile={() => setFile(null)} />
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
                                <p className="mb-4 font-medium">{file.name}</p>
                                <button onClick={handleAddNumbers} disabled={isProcessing} className="w-full bg-orange-500 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <><FileDigit /> <span>Add Page Numbers</span></>}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <a href={downloadUrl} download className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold">Download Numbered PDF</a>
                )}
            </div>
        </div>
    );
}
