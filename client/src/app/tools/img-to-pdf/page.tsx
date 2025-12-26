'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { ArrowRight, Download, Loader2 } from 'lucide-react';

export default function ImgToPdfPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles]);
        setError(null);
        setDownloadUrl(null);
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await api.post('/img-to-pdf', formData);
            setDownloadUrl(`http://localhost:3001${response.data.downloadUrl}`);
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.error
                || err.message
                || JSON.stringify(err);
            setError(`Debug: ${errorMsg} | Status: ${err.response?.status}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">JPG to PDF</h1>
                    <p className="text-lg text-gray-600">Convert your images to PDF documents.</p>
                </div>

                {!downloadUrl ? (
                    <div className="space-y-8">
                        <FileUpload
                            files={files}
                            onFilesSelected={handleFilesSelected}
                            onRemoveFile={handleRemoveFile}
                            multiple={true}
                            accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
                        />

                        {files.length > 0 && (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleConvert}
                                    disabled={isProcessing}
                                    className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-colors"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <span>Convert to PDF</span>}
                                </button>
                            </div>
                        )}
                        {error && <div className="text-red-500 text-center">{error}</div>}
                    </div>
                ) : (
                    <div className="text-center">
                        <a href={downloadUrl} download className="btn-primary">Download PDF</a>
                    </div>
                )}
            </div>
        </div>
    );
}
