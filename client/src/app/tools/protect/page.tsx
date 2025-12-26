'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { Shield, Loader2 } from 'lucide-react';

export default function ProtectPage() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleProtect = async () => {
        if (!file || !password) return;
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('password', password);

        try {
            const response = await api.post('/protect', formData);
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
                <h1 className="text-3xl font-bold mb-4">Protect PDF</h1>
                {!downloadUrl ? (
                    <div className="space-y-8">
                        {!file ? (
                            <FileUpload files={[]} onFilesSelected={(f) => setFile(f[0])} onRemoveFile={() => setFile(null)} />
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
                                <p className="mb-4 font-medium">{file.name}</p>
                                <input
                                    type="password"
                                    placeholder="Set a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border rounded-lg mb-4"
                                />
                                <button onClick={handleProtect} disabled={isProcessing || !password} className="w-full bg-gray-800 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <><Shield /> <span>Protect PDF</span></>}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <a href={downloadUrl} download className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold">Download Protected PDF</a>
                )}
            </div>
        </div>
    );
}
