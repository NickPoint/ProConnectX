import {Box, Card, CardActions, CardContent, CardMedia, LinearProgress, Typography} from '@mui/material';
import {useCallback, useState} from 'react';
import {fieldToInputBase, InputBaseProps} from "formik-mui";

export function FileUpload(props: InputBaseProps) {
    const {
        form: { setFieldValue },
        field: { name },
    } = props;

    const onChange = useCallback(
        (files: File[] | null) => {
            setFieldValue(name, files);
        },
        [setFieldValue, name]
    );

    return <FileUploadInput {...fieldToInputBase(props)} onChange={onChange} />;
}
export interface FileUploadInputProps {
    name: string;
    value: File[] | null;
    onChange: (files: File[] | null) => void;
    error?: boolean;
    helperText?: string;
}

interface UploadingFile {
    file: File;
    preview: string;
    progress: number;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ name, value, onChange, error, helperText }) => {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

    const handleFiles = (filesList: FileList | File[]) => {
        const files = Array.from(filesList);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length === 0) {
            alert('Only image files are allowed!');
            return;
        }

        const uploads: UploadingFile[] = imageFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
        }));

        setUploadingFiles(prev => [...prev, ...uploads]);

        uploads.forEach((upload, index) => {
            simulateUpload(upload, index, [...uploads]);
        });
    };

    const simulateUpload = (upload: UploadingFile, index: number, initialUploads: UploadingFile[]) => {
        const interval = setInterval(() => {
            setUploadingFiles(prevUploads => {
                const updated = [...prevUploads];
                if (updated[index].progress >= 100) {
                    clearInterval(interval);
                    // When all files finished -> call onChange
                    if (updated.every(f => f.progress >= 100)) {
                        onChange(updated.map(u => u.file));
                    }
                    return updated;
                }
                updated[index].progress += 10;
                return updated;
            });
        }, 200);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        handleFiles(files);
    }, []);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    return (
        <Box>
            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                    border: '2px dashed',
                    borderColor: error ? 'error.main' : 'grey.400',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'grey.50',
                    mb: 2,
                }}
                onClick={() => document.getElementById(`fileInput-${name}`)?.click()}
            >
                <Typography variant="body1" color="textSecondary">
                    Drag & drop images here, or click to select
                </Typography>
                <input
                    id={`fileInput-${name}`}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                />
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2}>
                {uploadingFiles.map((upload, idx) => (
                    <Card key={idx} sx={{ width: 150 }}>
                        <CardMedia
                            component="img"
                            height="100"
                            image={upload.preview}
                            alt="preview"
                            sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 1 }}>
                            <Typography variant="caption" noWrap>
                                {upload.file.name}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ p: 1 }}>
                            {upload.progress < 100 ? (
                                <Box width="100%">
                                    <LinearProgress variant="determinate" value={upload.progress} />
                                    <Typography variant="caption" display="block" align="center">
                                        {upload.progress}%
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="caption" color="success.main">
                                    Uploaded
                                </Typography>
                            )}
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {helperText && (
                <Typography variant="caption" color="error" mt={1}>
                    {helperText}
                </Typography>
            )}
        </Box>
    );
};