import { Button } from "@/components/ui/button"
import clsx from 'clsx';
import {Loader2} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DropZone } from "@/components/drop-zone.tsx";
import {useContext, useState} from "react";
import {Progress} from "@/components/ui/progress.tsx";
import {ErrorContext} from "@/App.tsx";

enum Status {
    IDLE,
    WORKING,
    ERROR,
}

export function CardWithForm() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [progress, setProgress] = useState(0);
    const { setDialog} = useContext(ErrorContext);

    const handleFileDownload = async () => {
        const fileSplit = file.name.split(".");
        const fileName = fileSplit[0];
        await fetch(`http://localhost:8000/download/${fileName}`, {
            headers: {
                'Content-Type': 'application/CSV',
            },
        })
            .then( res => res.blob())
            .then( blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
    }

    const handleFileUpload = () => {
        if (!file) {
            setStatus(Status.ERROR)
            setDialog("Please select a file to upload.")
            return;
        }

        const chunkSize = 5 * 1024 * 1024; // 5MB
        const totalChunks = Math.ceil(file.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = chunkSize;

        const uploadNextChunk = async () => {
            if (start <= file.size) {
                const chunk = file.slice(start, end);
                const formData = new FormData();
                formData.append("file", chunk);
                formData.append("chunkNumber", chunkNumber);
                formData.append("totalChunks", totalChunks);
                formData.append("originalname", file.name);

                try {
                    const response = await fetch('http://localhost:8000/upload', {
                        method: "POST",
                        body: formData,
                    })
                    const data = await response.json()

                    if(response.ok) {
                        setStatus(data.finish === true ? 2 : 1);
                        setProgress(Number((chunkNumber + 1) * chunkProgress));
                        chunkNumber++;
                        start = end;
                        end = start + chunkSize;
                        uploadNextChunk();
                    } else {
                        setDialog(data.message)
                    }
                } catch (error) {
                    setDialog(error.toString())
                }
            } else {
                setProgress(100);
                setStatus(Status.IDLE);
            }
        };

        setProgress(0);
        setStatus(Status.WORKING);
        uploadNextChunk();
    };

    return (
            <Card className={clsx("w-[350px]", [status === Status.ERROR && 'border-rose-500', status === Status.WORKING && 'border-yellow-500'])}>
                   <CardHeader>
                    <CardTitle>Planity</CardTitle>
                    <CardDescription>Send your CSV files</CardDescription>
                </CardHeader>
                <CardContent>
                    <DropZone
                        onChange={setFile}
                        className="w-full h-24"
                        fileExtension="csv"
                    />
                    {(progress > 0 && progress < 100) && <Progress className='p-5' value={progress}/>}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleFileUpload} disabled={!file || status === Status.WORKING}>
                        {progress > 0 && progress < 100 && <Loader2 className="animate-spin" />}
                        {progress > 0 && progress < 100 && 'Please wait'}
                        {(progress === 0 || progress === 100) && 'Upload File'}
                    </Button>

                    <Button onClick={handleFileDownload} disabled={progress < 100}>Download Zip</Button>
                </CardFooter>
            </Card>
    )
}