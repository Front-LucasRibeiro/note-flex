import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Redo,
  Undo,
  Heading1,
  Heading2,
  List,
  ListOrdered,
} from "lucide-react";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const applyFormat = (format: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const setHeading = (tag: "h1" | "h2") => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, tag);
      }
    });
  };

  return (
    <div className="flex gap-2 border-b p-2 bg-gray-50 rounded-t">
      {/* Undo / Redo */}
      <button
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Undo size={18} />
      </button>

      <button
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Redo size={18} />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Formatação básica */}
      <button
        onClick={() => applyFormat("bold")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => applyFormat("italic")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => applyFormat("underline")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Underline size={18} />
      </button>

      <button
        onClick={() => applyFormat("code")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Code size={18} />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Headings */}
      <button
        onClick={() => setHeading("h1")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => setHeading("h2")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Heading2 size={18} />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Listas */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ul")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ol")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <ListOrdered size={18} />
      </button>
    </div>
  );
}
