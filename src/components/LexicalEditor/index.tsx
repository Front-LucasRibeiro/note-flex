import { useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { $getRoot, $getSelection } from "lexical";
import { $createParagraphNode } from "lexical";
import { $createTextNode } from "lexical";
import  ToolbarPlugin from "../Editor/plugins/ToolbarPlugin"


// --- IMAGEM (CUSTOM NODE) ---
import {
  ImageNode,
  $createImageNode,
} from "../nodes/ImageNode";

import '../../styles/editor.css';

// ----------------------------
// CONFIG
// ----------------------------
const editorConfig = {
  namespace: "lexical-editor",
  theme: {
    paragraph: "editor-paragraph",
  },
  nodes: [ImageNode],
  onError(error: any) {
    console.error(error);
  },
};

export default function LexicalEditor({ onChange }) {
  const handleChange = useCallback(
    (editorState) => {
      editorState.read(() => {
        const html = $getRoot().getTextContent();
        onChange?.(html);
      });
    },
    [onChange]
  );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<div className="editor-placeholder">Digite aqui...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />

      <HistoryPlugin />
      <OnChangePlugin onChange={handleChange} />

      {/* Plugin para colar imagens */}
      <PasteImagePlugin />
    </LexicalComposer>
  );
}

// ----------------------------
// PLUGIN DE COLAR IMAGEM
// ----------------------------
function PasteImagePlugin() {
  return (
    <div
      onPaste={(e) => {
        const clipboardItems = e.clipboardData.items;

        for (let item of clipboardItems) {
          if (item.type.includes("image")) {
            const file = item.getAsFile();

            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result;

              window.editor.update(() => {
                const imageNode = $createImageNode(base64);
                $getRoot().append(imageNode);
              });
            };

            reader.readAsDataURL(file);
          }
        }
      }}
    />
  );
}
