import {useField} from "formik";
import {useRef} from "react";
import {
    MenuButtonAddTable,
    MenuButtonBold,
    MenuButtonBulletedList,
    MenuButtonItalic, MenuButtonOrderedList,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    RichTextEditorRef, TableBubbleMenu,
    TableImproved
} from "mui-tiptap";
import {useAppDispatch} from "../hooks.ts";
import {setActiveField} from "../../features/form/formSlice.ts";
import {FormControl, FormHelperText} from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import ListKeymap from '@tiptap/extension-list-keymap'

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
                extensions={[
                    StarterKit,
                    TableImproved,
                    TableRow,
                    TableHeader,
                    TableCell,
                    BulletList,
                    OrderedList,
                    ListItem,
                    ListKeymap,
                ]}
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
                        <MenuButtonBulletedList />
                        <MenuButtonOrderedList />
                        <MenuButtonAddTable />
                        <TableBubbleMenu />
                    </MenuControlsContainer>
                )}
            />
            {touched && error && (<FormHelperText>{error}</FormHelperText>)}
        </FormControl>
    );
}