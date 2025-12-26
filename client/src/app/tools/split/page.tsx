'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { ArrowRight, Download, Loader2 } from 'lucide-react';

export default function SplitPage() {
    const [file, setFile] = useState<File | null>(null);
    const [ranges, setRanges] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelected = (newFiles: File[]) => {
        if (newFiles.length > 0) {
            setFile(newFiles[0]);
            setError(null);
            setDownloadUrl(null);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleSplit = async () => {
        if (!file) return;
        if (!ranges.trim()) {
            setError('Please enter page ranges (e.g., 1-5, 8, 11-13).');
            return;
        }

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('ranges', ranges);

        try {
            const response = await api.post('/split', formData);
            setDownloadUrl(`http://localhost:3001${response.data.downloadUrl}`);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'An error occurred while splitting the PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Split PDF file</h1>
                    <p className="text-lg text-gray-600">Separate one page or a whole set for easy conversion into independent PDF files.</p>
                </div>

                {!downloadUrl ? (
                    <div className="space-y-8">
                        {!file ? (
                            <FileUpload
                                files={[]}
                                onFilesSelected={handleFilesSelected}
                                onRemoveFile={() => { }}
                                multiple={false}
                            />
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                            <Loader2 size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{file.name}</p>
                                            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button onClick={handleRemoveFile} className="text-gray-400 hover:text-red-500">Change</button>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Page Ranges to Extract
                                    </label>
                                    <input
                                        type="text"
                                        value={ranges}
                                        onChange={(e) => setRanges(e.target.value)}
                                        placeholder="e.g. 1-5, 8, 11-13"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Enter page numbers and/or ranges separated by commas.
                                    </p>
                                </div>

                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={handleSplit}
                                        disabled={isProcessing || !ranges.trim()}
                                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="animate-spin" />
                                                <span>Splitting PDF...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Split PDF</span>
                                                <ArrowRight />
                                            </>
                                        )}
                                    </button>
                                </div>
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">PDF has been split!</h2>
                            <p className="text-gray-500 mb-6">Your split PDF file is ready for download.</p>

                            <a
                                href={downloadUrl}
                                download
                                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                            >
                                <Download size={20} />
                                <span>Download Split PDF</span>
                            </a>
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setRanges('');
                                    setDownloadUrl(null);
                                }}
                                className="text-gray-500 hover:text-gray-900 underline"
                            >
                                Split another PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
