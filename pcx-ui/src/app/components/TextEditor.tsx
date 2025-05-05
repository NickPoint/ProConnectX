import {useField} from "formik";
import {useRef} from "react";
import {
    MenuButtonBold, MenuButtonItalic,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    RichTextEditorRef
} from "mui-tiptap";
import {useAppDispatch} from "../hooks.ts";
import {FormControl, FormHelperText, InputLabel} from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import {setActiveField} from "../../features/form/formSlice.ts";

const isVisuallyEmpty = (html: string) =>
    html
        // Remove all tags
        .replace(/<[^>]*>/g, '')
        // Remove HTML entities (e.g., &nbsp;)
        .replace(/&nbsp;|&#160;/gi, '')
        // Remove whitespace
        .trim() === '';

interface TextEditorProps {
    name: string,
}

export const TextEditor: React.FC<TextEditorProps> = ({name}) => {
    const [field, {error, touched}, helpers] = useField(name);
    const rteRef = useRef<RichTextEditorRef>(null);
    const dispatch = useAppDispatch();

    return (
        <FormControl fullWidth error={Boolean(touched && error)}>
            <RichTextEditor
                ref={rteRef}
                extensions={[StarterKit]}
                content={field.value}
                onFocus={() => dispatch(setActiveField(name))}
                onBlur={() => {
                    const rawHtml = rteRef.current?.editor?.getHTML() ?? '';
                    const normalizedHtml = isVisuallyEmpty(rawHtml) ? '' : rawHtml;
                    helpers.setValue(normalizedHtml).then(() =>
                        helpers.setTouched(true)
                    );
                }}
                renderControls={() => (
                    <MenuControlsContainer>
                        <MenuSelectHeading/>
                        <MenuDivider/>
                        <MenuButtonBold/>
                        <MenuButtonItalic/>
                        {/* More buttons */}
                    </MenuControlsContainer>
                )}
            />
            {touched && error && (<FormHelperText>{error}</FormHelperText>)}
        </FormControl>
    );
}