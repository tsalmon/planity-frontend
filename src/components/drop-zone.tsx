import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DropzoneProps {
    onChange: React.Dispatch<React.SetStateAction<File | null>>;
    className?: string;
    fileExtension?: string;
}

export function DropZone({
                             onChange,
                             className,
                             fileExtension,
                             ...props
                         }: DropzoneProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileInfo, setFileInfo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const { files } = e.dataTransfer;
        handleFiles(files);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files) {
            handleFiles(files);
        }
    };

    const handleFiles = (files: FileList) => {
        const uploadedFile = files[0];

        if (fileExtension && !uploadedFile.name.endsWith(`.${fileExtension}`)) {
            setError(`Invalid file type. Expected: .${fileExtension}`);
            return;
        }

        const fileSizeInKB = Math.round(uploadedFile.size / 1024); // Convert to KB

        onChange(() => uploadedFile);

        setFileInfo(`Uploaded file: ${uploadedFile.name} (${fileSizeInKB} KB)`);
        setError(null);
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Card
            className={`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${className}`}
            {...props}
        >
            <CardContent
                className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="flex items-center justify-center text-muted-foreground">
                    <span className="font-medium">Drag Files to Upload or</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto flex h-8 space-x-2 px-0 pl-1 text-xs"
                        onClick={handleButtonClick}
                    >
                        Click Here
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={`.${fileExtension}`}
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>
                {fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
                {error && <span className="text-red-500">{error}</span>}
            </CardContent>
        </Card>
    );
}