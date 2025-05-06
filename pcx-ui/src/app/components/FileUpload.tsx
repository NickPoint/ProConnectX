import {useField, useFormikContext} from 'formik';
import {useCallback, useState} from 'react';
import {Box, Card, CardActions, CardContent, CardMedia, IconButton, LinearProgress, Typography} from '@mui/material';
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Delete} from '@mui/icons-material';
import {useTranslation} from "react-i18next";
import {enqueueSnackbar} from "notistack";
import {useAppDispatch} from "../hooks.ts";
import {setActiveField} from "../../features/form/formSlice.ts";
import {t} from "i18next";

interface UploadingFile {
    file: File;
    preview: string;
    progress: number;
    id: string;
}

export interface FileUploadProps {
    name: string;
    label: string;
    multiple?: boolean;
    allowedMimeTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({ name, label, multiple = false, allowedMimeTypes}) => {
    const dispatch = useAppDispatch();
    const { setFieldValue } = useFormikContext<any>();
    const [field, meta, helpers] = useField(name);
    const initialUploads: UploadingFile[] = (field.value || []).map((file: File) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 100,
        id: URL.createObjectURL(file) + Math.random(),
    }));
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([...initialUploads]);
    const {t} = useTranslation();

    const handleFiles = (filesList: FileList | File[]) => {
        const files = Array.from(filesList);
        const existingFileNames = uploadingFiles.map(f => f.file.name);

        const validFiles: File[] = [];
        const errors: string[] = [];

        files.forEach(file => {
            const isAllowed = allowedMimeTypes?.some(type => file.type.startsWith(type));
            const isDuplicate = existingFileNames.includes(file.name);

            if (!isAllowed && allowedMimeTypes && allowedMimeTypes.length > 0) {
                errors.push(t('form.fileUpload.error.typeNotAllowed', {fileName: file.name}));
            } else if (isDuplicate) {
                errors.push(t('form.fileUpload.error.isAreadyLoaded', {fileName: file.name}));
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            enqueueSnackbar(errors.join('\n'));
        }

        if (validFiles.length === 0) return;

        const uploads: UploadingFile[] = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            id: URL.createObjectURL(file) + Math.random(),
        }));

        setUploadingFiles(prev => [...prev, ...uploads]);
        uploads.forEach(upload => simulateUpload(upload, [...uploadingFiles, ...uploads]))
    };

    const simulateUpload = (upload: UploadingFile, resultingList: UploadingFile[]) => {
        const interval = setInterval(() => {
            setUploadingFiles(prevUploads => {
                const index = prevUploads.findIndex(u => u.id === upload.id);
                if (index === -1) return prevUploads;

                const updated = [...prevUploads];
                if (updated[index].progress >= 100) {
                    clearInterval(interval);
                    return updated;
                }

                updated[index].progress += 10;
                return updated;
            });
        }, 200);
        setFieldValue(name, resultingList.map(u => u.file));
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(e.dataTransfer.files);
    }, [multiple, uploadingFiles]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const handleRemove = (id: string) => {
        const updated = uploadingFiles.filter(u => u.id !== id);
        setUploadingFiles(updated);
        setFieldValue(name, updated.map(u => u.file));
    };

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = uploadingFiles.findIndex(f => f.id === active.id);
            const newIndex = uploadingFiles.findIndex(f => f.id === over.id);
            const reordered = arrayMove(uploadingFiles, oldIndex, newIndex);
            setUploadingFiles(reordered);
            setFieldValue(name, reordered.map(u => u.file));
        }
    };

    return (
        <Box onPointerEnter={() => dispatch(setActiveField(name))}>
            <Typography>{label}</Typography>
            <Box
                onDrop={handleDrop}
                onDragOver={e => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
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
                    {t('form.fileUpload.placeholder')}
                </Typography>
                <input
                    id={`fileInput-${name}`}
                    name={name}
                    type="file"
                    multiple={multiple}
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
                            {t('form.fileUpload.uploaded')}
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
