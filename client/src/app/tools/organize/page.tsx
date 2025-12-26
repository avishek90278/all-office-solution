'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/api';
import { ArrowRight, LayoutGrid, Loader2 } from 'lucide-react';

export default function OrganizePage() {
    const [file, setFile] = useState<File | null>(null);
    const [order, setOrder] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleOrganize = async () => {
        if (!file || !order) return;
        setIsProcessing(true);

        // Parse order string "1,3,2" -> [0, 2, 1]
        const pages = order.split(',').map(s => parseInt(s.trim()) - 1).filter(n => !isNaN(n));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('pages', JSON.stringify(pages));

        try {
            const response = await api.post('/organize', formData);
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
                <h1 className="text-3xl font-bold mb-4">Organize PDF</h1>
                <p className="mb-8 text-gray-600">Enter the page numbers in the order you want them. You can omit pages to delete them.</p>

                {!downloadUrl ? (
                    <div className="space-y-8">
                        {!file ? (
                            <FileUpload files={[]} onFilesSelected={(f) => setFile(f[0])} onRemoveFile={() => setFile(null)} />
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
                                <p className="mb-4 font-medium">{file.name}</p>
                                <input
                                    type="text"
                                    placeholder="e.g. 1, 3, 2, 4"
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    className="w-full p-3 border rounded-lg mb-4"
                                />
                                <button onClick={handleOrganize} disabled={isProcessing || !order} className="w-full bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <><LayoutGrid /> <span>Organize PDF</span></>}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <a href={downloadUrl} download className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold">Download Organized PDF</a>
                )}
            </div>
        </div>
    );
}
