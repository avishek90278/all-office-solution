'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { Crop, Loader2 } from 'lucide-react';

export default function CropPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleCrop = async () => {
        if (!file) return;
        setIsProcessing(true);

        // Hardcoded crop for demo: Crop 10% from all sides
        const formData = new FormData();
        formData.append('file', file);
        formData.append('x', '10');
        formData.append('y', '10');
        formData.append('width', '80');
        formData.append('height', '80');

        try {
            const response = await api.post('/crop', formData);
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
                <h1 className="text-3xl font-bold mb-4">Crop PDF</h1>
                {!downloadUrl ? (
                    <div className="space-y-8">
                        {!file ? (
                            <FileUpload files={[]} onFilesSelected={(f) => setFile(f[0])} onRemoveFile={() => setFile(null)} />
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
                                <p className="mb-4 font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500 mb-4">Demo: Crops 10% margin from all sides.</p>
                                <button onClick={handleCrop} disabled={isProcessing} className="w-full bg-green-600 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <><Crop /> <span>Crop PDF</span></>}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <a href={downloadUrl} download className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold">Download Cropped PDF</a>
                )}
            </div>
        </div>
    );
}
