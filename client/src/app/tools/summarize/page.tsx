'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function SummarizePdf() {
    const [files, setFiles] = useState<File[]>([]);
    const [summary, setSummary] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelected = (newFiles: File[]) => {
        setFiles([newFiles[0]]);
        setSummary(null);
        setError(null);
    };

    const handleRemoveFile = (index: number) => {
        setFiles([]);
    };

    const handleSubmit = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', files[0]);

        try {
            const response = await api.post('/summarize', formData);
            setSummary(response.data.summary);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Summarization failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 text-center">AI PDF Summarizer</h1>
            <p className="text-center text-gray-600 mb-8">
                Upload a PDF and get an instant AI-generated summary.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="space-y-6">
                    <FileUpload
                        files={files}
                        onFilesSelected={handleFilesSelected}
                        onRemoveFile={handleRemoveFile}
                        multiple={false}
                        accept={{ 'application/pdf': ['.pdf'] }}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={files.length === 0 || isProcessing}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors flex justify-center items-center ${files.length === 0 || isProcessing
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                    >
                        {isProcessing ? <Loader2 className="animate-spin mr-2" /> : null}
                        {isProcessing ? 'Analyzing...' : 'Summarize PDF'}
                    </button>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                {summary && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Summary</h2>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 leading-relaxed">
                            {summary}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
