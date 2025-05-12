import {Button, Card, CardActions, CardContent, Paper} from "@mui/material";
import { FileDto } from "../../features/api/pcxApi";
import Typography from "@mui/material/Typography";
import {parseOffsetDateTimeToString} from "../../utils/dateParser.ts";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { Download } from "@mui/icons-material";
import {useLazyGetFileQuery} from "../../features/api/enhancedApi.ts";

const FileCard = ({ file }: {file: FileDto}) => {

    return (
        <Paper sx={{p: 1}}>
            <Stack direction='row' justifyContent='space-between'>
                <Stack>
                    <Typography variant="body1">{file.originalFileName}</Typography>
                    <Typography variant="body2" color="textSecondary">{parseOffsetDateTimeToString(file.uploadedAt)}</Typography>
                </Stack>
                <IconButton component='a' download href={`${import.meta.env.VITE_API_URL}files/${file.id}`}>
                    <Download />
                </IconButton>
            </Stack>
        </Paper>
    );
};

export default FileCard;