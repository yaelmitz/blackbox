import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import BorderColor from "@mui/icons-material/BorderColor";
import Checklist from "@mui/icons-material/Checklist";
import FormatAlignCenter from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustify from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeft from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRight from "@mui/icons-material/FormatAlignRight";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatClear from "@mui/icons-material/FormatClear";
import FormatColorText from "@mui/icons-material/FormatColorText";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import FormatQuote from "@mui/icons-material/FormatQuote";
import FormatStrikethrough from "@mui/icons-material/FormatStrikethrough";
import FormatUnderlined from "@mui/icons-material/FormatUnderlined";
import GridOn from "@mui/icons-material/GridOn";
import HorizontalRule from "@mui/icons-material/HorizontalRule";
import InsertLink from "@mui/icons-material/InsertLink";
import Redo from "@mui/icons-material/Redo";
import Subscript from "@mui/icons-material/Subscript";
import Superscript from "@mui/icons-material/Superscript";
import Undo from "@mui/icons-material/Undo";
import type { Editor } from "@tiptap/react";
import { useState, type MouseEvent, type ReactNode } from "react";
import { BLOCK_STYLES, HEADING_LEVELS, HIGHLIGHT_COLORS, NEW_TABLE, TEXT_COLORS, type BlockStyle } from "../../../constants/richText";
import { RteColorMenu } from "../RteColorMenu";
import { RteLinkDialog } from "../RteLinkDialog";
import { useStyles } from "./RteToolbar.styles";

type Tool = {
  title: string;
  /** keyboard shortcut shown in the tooltip */
  keys?: string;
  icon: ReactNode;
  run: (e: Editor) => void;
  active?: (e: Editor) => boolean;
  disabled?: (e: Editor) => boolean;
};

const i = (Icon: typeof Undo) => <Icon fontSize="small" />;

const HISTORY: Tool[] = [
  { title: "ביטול", keys: "Ctrl+Z", icon: i(Undo), run: (e) => e.chain().focus().undo().run(), disabled: (e) => !e.can().undo() },
  { title: "חזרה", keys: "Ctrl+Y", icon: i(Redo), run: (e) => e.chain().focus().redo().run(), disabled: (e) => !e.can().redo() },
];

const MARKS: Tool[] = [
  { title: "מודגש", keys: "Ctrl+B", icon: i(FormatBold), run: (e) => e.chain().focus().toggleBold().run(), active: (e) => e.isActive("bold") },
  { title: "נטוי", keys: "Ctrl+I", icon: i(FormatItalic), run: (e) => e.chain().focus().toggleItalic().run(), active: (e) => e.isActive("italic") },
  { title: "קו תחתון", keys: "Ctrl+U", icon: i(FormatUnderlined), run: (e) => e.chain().focus().toggleUnderline().run(), active: (e) => e.isActive("underline") },
  { title: "קו חוצה", icon: i(FormatStrikethrough), run: (e) => e.chain().focus().toggleStrike().run(), active: (e) => e.isActive("strike") },
  { title: "כתב עילי", icon: i(Superscript), run: (e) => e.chain().focus().toggleSuperscript().run(), active: (e) => e.isActive("superscript") },
  { title: "כתב תחתי", icon: i(Subscript), run: (e) => e.chain().focus().toggleSubscript().run(), active: (e) => e.isActive("subscript") },
];

const BLOCKS: Tool[] = [
  { title: "רשימת תבליטים", icon: i(FormatListBulleted), run: (e) => e.chain().focus().toggleBulletList().run(), active: (e) => e.isActive("bulletList") },
  { title: "רשימה ממוספרת", icon: i(FormatListNumbered), run: (e) => e.chain().focus().toggleOrderedList().run(), active: (e) => e.isActive("orderedList") },
  { title: "רשימת משימות (תיבות סימון)", icon: i(Checklist), run: (e) => e.chain().focus().toggleTaskList().run(), active: (e) => e.isActive("taskList") },
  { title: "ציטוט", icon: i(FormatQuote), run: (e) => e.chain().focus().toggleBlockquote().run(), active: (e) => e.isActive("blockquote") },
  { title: "קו מפריד", icon: i(HorizontalRule), run: (e) => e.chain().focus().setHorizontalRule().run() },
  {
    title: "הוספת טבלה",
    icon: i(GridOn),
    run: (e) => e.chain().focus().insertTable(NEW_TABLE).run(),
    active: (e) => e.isActive("table"),
    disabled: (e) => e.isActive("table"),
  },
];

const ALIGN: Tool[] = [
  { title: "יישור לימין", icon: i(FormatAlignRight), run: (e) => e.chain().focus().setTextAlign("right").run(), active: (e) => e.isActive({ textAlign: "right" }) },
  { title: "מרכוז", icon: i(FormatAlignCenter), run: (e) => e.chain().focus().setTextAlign("center").run(), active: (e) => e.isActive({ textAlign: "center" }) },
  { title: "יישור לשמאל", icon: i(FormatAlignLeft), run: (e) => e.chain().focus().setTextAlign("left").run(), active: (e) => e.isActive({ textAlign: "left" }) },
  { title: "יישור לשני הצדדים", icon: i(FormatAlignJustify), run: (e) => e.chain().focus().setTextAlign("justify").run(), active: (e) => e.isActive({ textAlign: "justify" }) },
];

const CLEAR: Tool = { title: "ניקוי עיצוב", icon: i(FormatClear), run: (e) => e.chain().focus().unsetAllMarks().clearNodes().run() };

function blockStyleOf(e: Editor): BlockStyle {
  const level = HEADING_LEVELS.find((l) => e.isActive("heading", { level: l }));
  return level ? (String(level) as BlockStyle) : "p";
}

function setBlockStyle(e: Editor, v: BlockStyle) {
  if (v === "p") e.chain().focus().setParagraph().run();
  else e.chain().focus().setHeading({ level: Number(v) as (typeof HEADING_LEVELS)[number] }).run();
}

/** The editor's toolbar: history, paragraph style, marks, colours, link, lists and blocks, alignment */
interface Props {
  editor: Editor;
  /** the link dialog is open (also opened by Ctrl+K inside the editor) */
  linkOpen: boolean;
  onLinkOpenChange: (open: boolean) => void;
}

export function RteToolbar({ editor, linkOpen, onLinkOpenChange: setLinkOpen }: Props) {
  const { classes, cx, css } = useStyles();
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);
  const [markAnchor, setMarkAnchor] = useState<HTMLElement | null>(null);

  const textColor = (editor.getAttributes("textStyle").color as string | undefined) ?? null;
  const highlight = (editor.getAttributes("highlight").color as string | undefined) ?? null;
  const linkUrl = (editor.getAttributes("link").href as string | undefined) ?? "";

  const button = (t: Tool, extra?: { onClick?: (ev: MouseEvent<HTMLElement>) => void; selected?: boolean; children?: ReactNode }) => (
    <Tooltip key={t.title} title={t.keys ? `${t.title} (${t.keys})` : t.title}>
      <Box component="span">
        <ToggleButton
          value={t.title}
          size="small"
          selected={extra?.selected ?? (t.active ? t.active(editor) : false)}
          disabled={t.disabled?.(editor) ?? false}
          aria-label={t.title}
          onMouseDown={(ev) => ev.preventDefault()}
          onClick={(ev) => (extra?.onClick ? extra.onClick(ev) : t.run(editor))}
          className={classes.tool}
        >
          {extra?.children ?? t.icon}
        </ToggleButton>
      </Box>
    </Tooltip>
  );

  const group = (key: string, children: ReactNode) => (
    <Box key={key} className={classes.group}>
      {children}
    </Box>
  );
  const sep = (key: string) => <Divider key={key} orientation="vertical" flexItem className={classes.divider} />;

  /** colour button: the icon with a bar of the current colour under it */
  const swatchIcon = (Icon: typeof Undo, color: string | null) => (
    <Box component="span" className={classes.swatchIcon}>
      <Icon fontSize="small" />
      <Box component="span" className={cx(classes.swatchBar, color ? css({ backgroundColor: color }) : classes.swatchNone)} />
    </Box>
  );

  const saveLink = (url: string) => {
    const chain = editor.chain().focus();
    if (editor.state.selection.empty && !editor.isActive("link")) {
      chain.insertContent({ type: "text", text: url, marks: [{ type: "link", attrs: { href: url } }] }).run();
    } else {
      chain.extendMarkRange("link").setLink({ href: url }).run();
    }
    setLinkOpen(false);
  };
  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkOpen(false);
  };

  return (
    <Box className={classes.root} role="toolbar" aria-label="עיצוב טקסט">
      {group("history", HISTORY.map((t) => button(t)))}
      {sep("s1")}
      <TextField
        select
        size="small"
        value={blockStyleOf(editor)}
        onChange={(ev) => setBlockStyle(editor, ev.target.value as BlockStyle)}
        inputProps={{ "aria-label": "סגנון פסקה" }}
        className={classes.blockSelect}
      >
        {BLOCK_STYLES.map((s) => (
          <MenuItem key={s.value} value={s.value} className={classes[`style${s.value}`]}>
            {s.label}
          </MenuItem>
        ))}
      </TextField>
      {sep("s2")}
      {group(
        "marks",
        <>
          {MARKS.map((t) => button(t))}
          {button(
            { title: "צבע טקסט", icon: null, run: () => undefined },
            { onClick: (ev) => setColorAnchor(ev.currentTarget), selected: !!textColor, children: swatchIcon(FormatColorText, textColor) },
          )}
          {button(
            { title: "מרקר הדגשה", icon: null, run: () => undefined },
            { onClick: (ev) => setMarkAnchor(ev.currentTarget), selected: editor.isActive("highlight"), children: swatchIcon(BorderColor, highlight) },
          )}
          {button({ title: "קישור", keys: "Ctrl+K", icon: i(InsertLink), run: () => setLinkOpen(true), active: (e) => e.isActive("link") })}
          {button(CLEAR)}
        </>,
      )}
      {sep("s3")}
      {group("blocks", BLOCKS.map((t) => button(t)))}
      {sep("s4")}
      {group("align", ALIGN.map((t) => button(t)))}

      <RteColorMenu
        anchorEl={colorAnchor}
        onClose={() => setColorAnchor(null)}
        title="צבע טקסט"
        colors={TEXT_COLORS}
        current={textColor}
        onPick={(c) => {
          editor.chain().focus().setColor(c).run();
          setColorAnchor(null);
        }}
        resetLabel="צבע רגיל"
        onReset={() => {
          editor.chain().focus().unsetColor().run();
          setColorAnchor(null);
        }}
      />
      <RteColorMenu
        anchorEl={markAnchor}
        onClose={() => setMarkAnchor(null)}
        title="מרקר הדגשה"
        colors={HIGHLIGHT_COLORS}
        current={highlight}
        onPick={(c) => {
          editor.chain().focus().setHighlight({ color: c }).run();
          setMarkAnchor(null);
        }}
        resetLabel="ללא הדגשה"
        onReset={() => {
          editor.chain().focus().unsetHighlight().run();
          setMarkAnchor(null);
        }}
      />
      <RteLinkDialog open={linkOpen} initialUrl={linkUrl} onClose={() => setLinkOpen(false)} onSave={saveLink} onRemove={removeLink} />
    </Box>
  );
}
