'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    files: File[];
    onRemoveFile: (index: number) => void;
    multiple?: boolean;
    accept?: Record<string, string[]>;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFilesSelected,
    files,
    onRemoveFile,
    multiple = false,
    accept = { 'application/pdf': ['.pdf'] }
}) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onFilesSelected(acceptedFiles);
    }, [onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple,
        accept
    });

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                {...getRootProps()}
                className={clsx(
                    "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-red-400 hover:bg-gray-50"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-red-100 rounded-full text-red-600">
                        <Upload size={40} />
                    </div>
                    <div className="text-lg font-medium text-gray-700">
                        {isDragActive ? "Drop files here..." : "Drag & drop PDF files here"}
                    </div>
                    <div className="text-sm text-gray-500">
                        or click to select files
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-center space-x-3">
                                <FileIcon className="text-red-500" size={24} />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onRemoveFile(index)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
