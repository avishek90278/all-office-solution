'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { ArrowRight, RotateCw, Loader2 } from 'lucide-react';

export default function RotatePage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelected = (newFiles: File[]) => {
        if (newFiles.length > 0) setFile(newFiles[0]);
    };

    const handleRotate = async () => {
        if (!file) return;
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('angle', '90'); // Simple 90 degree rotation for now

        try {
            const response = await api.post('/rotate', formData);
            setDownloadUrl(`http://localhost:3001${response.data.downloadUrl}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error rotating PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4">Rotate PDF</h1>
                {!downloadUrl ? (
                    <div className="space-y-8">
                        {!file ? (
                            <FileUpload files={[]} onFilesSelected={handleFilesSelected} onRemoveFile={() => setFile(null)} />
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <p className="mb-4">{file.name}</p>
                                <button onClick={handleRotate} disabled={isProcessing} className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center mx-auto space-x-2">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <><RotateCw /> <span>Rotate 90° Right</span></>}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <a href={downloadUrl} download className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold">Download Rotated PDF</a>
                )}
            </div>
        </div>
    );
}
