'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { ArrowRight, Download, Loader2 } from 'lucide-react';

export default function MergePage() {
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

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please select at least 2 PDF files to merge.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await api.post('/merge', formData);
            setDownloadUrl(`http://localhost:3001${response.data.downloadUrl}`);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'An error occurred while merging PDFs.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Merge PDF files</h1>
                    <p className="text-lg text-gray-600">Combine PDFs in the order you want with the easiest PDF merger available.</p>
                </div>

                {!downloadUrl ? (
                    <div className="space-y-8">
                        <FileUpload
                            files={files}
                            onFilesSelected={handleFilesSelected}
                            onRemoveFile={handleRemoveFile}
                            multiple={true}
                        />

                        {files.length > 0 && (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleMerge}
                                    disabled={isProcessing || files.length < 2}
                                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-xl text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            <span>Merging PDFs...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Merge PDF</span>
                                            <ArrowRight />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-200 inline-block">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Download size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">PDFs have been merged!</h2>
                            <p className="text-gray-500 mb-6">Your merged PDF file is ready for download.</p>

                            <a
                                href={downloadUrl}
                                download
                                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                            >
                                <Download size={20} />
                                <span>Download Merged PDF</span>
                            </a>
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setFiles([]);
                                    setDownloadUrl(null);
                                }}
                                className="text-gray-500 hover:text-gray-900 underline"
                            >
                                Merge more PDFs
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
