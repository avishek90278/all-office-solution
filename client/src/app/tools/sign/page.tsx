'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { PenTool, Loader2 } from 'lucide-react';

export default function SignPage() {
    const [file, setFile] = useState<File | null>(null);
    const [signature, setSignature] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleSign = async () => {
        if (!file || !signature) return;
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature);

        try {
            const response = await api.post('/sign', formData);
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
                <h1 className="text-3xl font-bold mb-4">Sign PDF</h1>
                {!downloadUrl ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold mb-2">1. Upload PDF</h3>
                                <FileUpload
                                    files={file ? [file] : []}
                                    onFilesSelected={(f) => setFile(f[0])}
                                    onRemoveFile={() => setFile(null)}
                                />
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">2. Upload Signature (PNG/JPG)</h3>
                                <FileUpload
                                    files={signature ? [signature] : []}
                                    onFilesSelected={(f) => setSignature(f[0])}
                                    onRemoveFile={() => setSignature(null)}
                                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                                />
                            </div>
                        </div>

                        {file && signature && (
                            <button onClick={handleSign} disabled={isProcessing} className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center mx-auto space-x-2">
                                {isProcessing ? <Loader2 className="animate-spin" /> : <><PenTool /> <span>Sign PDF</span></>}
                            </button>
                        )}
                    </div>
                ) : (
                    <a href={downloadUrl} download className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold">Download Signed PDF</a>
                )}
            </div>
        </div>
    );
}
