'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function OfficeToPdf() {
    const [files, setFiles] = useState<File[]>([]);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelected = (newFiles: File[]) => {
        // Single file mode, replace existing
        setFiles([newFiles[0]]);
        setDownloadUrl(null);
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
            const response = await api.post('/office-to-pdf', formData);
            setDownloadUrl(response.data.downloadUrl);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Conversion failed. Ensure LibreOffice is installed on the server.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Office to PDF</h1>
            <p className="text-center text-gray-600 mb-8">
                Convert Word, Excel, and PowerPoint files to PDF instantly.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="space-y-6">
                    <FileUpload
                        files={files}
                        onFilesSelected={handleFilesSelected}
                        onRemoveFile={handleRemoveFile}
                        multiple={false}
                        accept={{
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                            'application/msword': ['.doc'],
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                            'application/vnd.ms-excel': ['.xls'],
                            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
                            'application/vnd.ms-powerpoint': ['.ppt']
                        }}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={files.length === 0 || isProcessing}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors flex justify-center items-center ${files.length === 0 || isProcessing
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isProcessing ? <Loader2 className="animate-spin mr-2" /> : null}
                        {isProcessing ? 'Converting...' : 'Convert to PDF'}
                    </button>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                {downloadUrl && (
                    <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200 text-center">
                        <p className="mb-2">Conversion successful!</p>
                        <a
                            href={`http://localhost:3001${downloadUrl}`}
                            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                            download
                        >
                            Download PDF
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
