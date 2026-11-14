import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { HEADING_LEVELS } from "../../../constants/richText";
import { textStats } from "../../../utils/format";
import { RteTableBar } from "../RteTableBar";
import { RteToolbar } from "../RteToolbar";
import { useStyles } from "./RichTextEditor.styles";

interface Props {
  id: string;
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
}

const EXTENSIONS = [
  StarterKit.configure({ heading: { levels: [...HEADING_LEVELS] }, code: false, codeBlock: false }),
  Underline,
  Subscript,
  Superscript,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["mailto", "tel"],
    HTMLAttributes: { target: "_blank", rel: "noopener noreferrer nofollow" },
  }),
  TextAlign.configure({ types: ["heading", "paragraph"], alignments: ["right", "center", "left", "justify"], defaultAlignment: "right" }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
];

/**
 * Word-like rich text box. The value is HTML.
 * Paragraph styles and headings, bold / italic / underline / strike / super- and subscript, text colour,
 * highlighter, links (Ctrl+K), bullet / numbered / checklist lists, quotes, divider lines, tables,
 * alignment, clear formatting, undo / redo, and a word count.
 */
export function RichTextEditor({ id, value, onChange, onBlur, placeholder, invalid }: Props) {
  const { classes, cx } = useStyles();
  const [linkOpen, setLinkOpen] = useState(false);
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: value,
    editorProps: {
      attributes: { id, dir: "rtl", class: "rte-body", role: "textbox", "aria-multiline": "true" },
      handleKeyDown: (_view, event) => {
        // Ctrl/Cmd+K: link dialog (by physical key, so it also works with the Hebrew layout)
        if ((event.ctrlKey || event.metaKey) && event.code === "KeyK") {
          event.preventDefault();
          setLinkOpen(true);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    onBlur: () => onBlur?.(),
  });

  useEffect(() => {
    if (editor && value === "" && !editor.isEmpty) editor.commands.clearContent();
  }, [editor, value]);

  if (!editor) return null;

  const { words, chars } = textStats(editor.state.doc.textBetween(0, editor.state.doc.content.size, " ", " "));

  return (
    <Box className={cx(classes.root, invalid && classes.invalid)}>
      <RteToolbar editor={editor} linkOpen={linkOpen} onLinkOpenChange={setLinkOpen} />
      <RteTableBar editor={editor} />
      <Box className={cx(classes.body, editor.isEmpty && classes.empty)} data-placeholder={placeholder}>
        <EditorContent editor={editor} />
      </Box>
      <Box className={classes.footer}>
        <Typography variant="label" color="text.secondary">
          {words} מילים · {chars} תווים
        </Typography>
      </Box>
    </Box>
  );
}
