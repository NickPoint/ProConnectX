import { useFormikContext, useField } from 'formik';
import { useState, useCallback } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, CardActions, IconButton, LinearProgress } from '@mui/material';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy, useSortable, arrayMove} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {Delete} from '@mui/icons-material';

interface UploadingFile {
    file: File;
    preview: string;
    progress: number;
    id: string;
}

interface FileUploadProps {
    name: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ name }) => {
    const { setFieldValue } = useFormikContext<any>();
    const [field, meta] = useField(name);
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
            id: URL.createObjectURL(file) + Math.random(), // generate a unique id
        }));

        setUploadingFiles(prev => [...prev, ...uploads]);

        uploads.forEach((upload, index) => {
            simulateUpload(upload);
        });
    };

    const simulateUpload = (upload: UploadingFile) => {
        const interval = setInterval(() => {
            setUploadingFiles(prevUploads => {
                const index = prevUploads.findIndex(u => u.id === upload.id);
                if (index === -1) return prevUploads;

                const updated = [...prevUploads];
                if (updated[index].progress >= 100) {
                    clearInterval(interval);
                    setFieldValue(name, updated.map(u => u.file));
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

    const handleRemove = (id: string) => {
        setUploadingFiles(prev => {
            const updated = prev.filter(u => u.id !== id);
            setFieldValue(name, updated.map(u => u.file));
            return updated;
        });
    };

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setUploadingFiles(prev => {
                const oldIndex = prev.findIndex(f => f.id === active.id);
                const newIndex = prev.findIndex(f => f.id === over.id);
                const reordered = arrayMove(prev, oldIndex, newIndex);
                setFieldValue(name, reordered.map(u => u.file));
                return reordered;
            });
        }
    };

    return (
        <Box>
            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                    border: '2px dashed',
                    borderColor: 'grey.400',
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

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={uploadingFiles.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        {uploadingFiles.map(upload => (
                            <SortableImage key={upload.id} upload={upload} onRemove={handleRemove} />
                        ))}
                    </Box>
                </SortableContext>
            </DndContext>

            {meta.touched && meta.error && (
                <Typography variant="caption" color="error" mt={1}>
                    {meta.error}
                </Typography>
            )}
        </Box>
    );
};

interface SortableImageProps {
    upload: UploadingFile;
    onRemove: (id: string) => void;
}

const SortableImage: React.FC<SortableImageProps> = ({ upload, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: upload.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card ref={setNodeRef} style={style} sx={{ width: 150 }}>
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
            <CardActions sx={{ p: 1, justifyContent: 'space-between' }}>
                {upload.progress < 100 ? (
                    <Box width="100%">
                        <LinearProgress variant="determinate" value={upload.progress} />
                        <Typography variant="caption" display="block" align="center">
                            {upload.progress}%
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="caption" color="success.main">
                            Uploaded
                        </Typography>
                        <IconButton size="small" onClick={() => onRemove(upload.id)}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </>
                )}
            </CardActions>
        </Card>
    );
};
