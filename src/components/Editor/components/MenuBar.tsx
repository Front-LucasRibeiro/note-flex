import { Editor } from "@tiptap/react";
import { Stack, IconButton, Tooltip } from "@mui/material";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

interface MenuBarProps {
  editor: Editor | null;
}

export const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) return null;

  const getColor = (format: string) => 
    editor.isActive(format) ? 'primary' : 'default';

  return (
    <Stack direction="row" spacing={1} mb={2}>
      <Tooltip title="Negrito">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={getColor("bold")}
        >
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Itálico">
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={getColor("italic")}
        >
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Tachado">
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          color={getColor("strike")}
        >
          <StrikethroughSIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Código">
        <IconButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          color={getColor("code")}
        >
          <CodeIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Citação">
        <IconButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          color={getColor("blockquote")}
        >
          <FormatQuoteIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Lista não ordenada">
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={getColor("bulletList")}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Lista ordenada">
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={getColor("orderedList")}
        >
          <FormatListNumberedIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
