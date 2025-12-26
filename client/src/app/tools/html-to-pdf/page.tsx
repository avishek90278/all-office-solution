'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { Globe, Loader2 } from 'lucide-react';

export default function HtmlToPdfPage() {
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleConvert = async () => {
        if (!url) return;
        setIsProcessing(true);

        try {
            const response = await api.post('/html-to-pdf', { url });
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
                <h1 className="text-3xl font-bold mb-4">HTML to PDF</h1>
                {!downloadUrl ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
                        <input
                            type="url"
                            placeholder="Enter website URL (e.g. https://google.com)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-3 border rounded-lg mb-4"
                        />
                        <button onClick={handleConvert} disabled={isProcessing || !url} className="w-full bg-teal-600 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
                            {isProcessing ? <Loader2 className="animate-spin" /> : <><Globe /> <span>Convert URL</span></>}
                        </button>
                    </div>
                ) : (
                    <a href={downloadUrl} download className="bg-teal-600 text-white px-8 py-3 rounded-lg font-bold">Download PDF</a>
                )}
            </div>
        </div>
    );
}
