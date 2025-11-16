import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  FileText,
  Heading1,
  Heading2,
  Image,
  Italic,
  List,
  ListOrdered,
  Plus,
  Quote,
  Underline,
} from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

// Lexical imports
import "@/styles/editor.css";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  createEditor,
} from "lexical";

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  onAutoSave?: (content: string) => void;
}

// Theme for the editor
const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    code: "editor-text-code",
  },
};

// Catch any errors
function onError(error: Error) {
  console.error(error);
}

// Plugin for auto-save
function AutoSavePlugin({
  onAutoSave,
}: {
  onAutoSave?: (content: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        if (onAutoSave) {
          // Clear existing timeout
          if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
          }

          // Set a new timeout (save after 1 second of inactivity)
          autoSaveTimeoutRef.current = setTimeout(() => {
            // Serialize the editor state to JSON
            const json = JSON.stringify(editorState.toJSON());
            onAutoSave(json);
          }, 1000);
        }
      }
    );

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      removeUpdateListener();
    };
  }, [editor, onAutoSave]);

  return null;
}

// Plugin for text formatting (Bold, Italic, etc.)
function FormatTextPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsUnderline(selection.hasFormat("underline"));
          setIsCode(selection.hasFormat("code"));
        }
      });
    });
  }, [editor]);

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const formatCode = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
  };

  return (
    <>
      <Toggle
        aria-label="Negrito"
        pressed={isBold}
        onPressedChange={formatBold}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Itálico"
        pressed={isItalic}
        onPressedChange={formatItalic}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Sublinhado"
        pressed={isUnderline}
        onPressedChange={formatUnderline}
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Código" pressed={isCode} onPressedChange={formatCode}>
        <Code className="h-4 w-4" />
      </Toggle>
    </>
  );
}

// Plugin for block formatting (Paragraphs, Headings, etc.)
function BlockFormatPlugin() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState("paragraph");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element =
            anchorNode.getKey() === "root"
              ? anchorNode
              : anchorNode.getTopLevelElementOrThrow();

          const elementKey = element.getKey();
          const elementDOM = editor.getElementByKey(elementKey);

          if (elementDOM !== null) {
            if (elementDOM.tagName === "P") {
              setBlockType("paragraph");
            } else if (elementDOM.tagName === "H1") {
              setBlockType("h1");
            } else if (elementDOM.tagName === "H2") {
              setBlockType("h2");
            } else if (elementDOM.tagName === "BLOCKQUOTE") {
              setBlockType("quote");
            } else {
              setBlockType("paragraph");
            }
          }
        }
      });
    });
  }, [editor]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading1 = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h1"));
      }
    });
  };

  const formatHeading2 = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h2"));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (
    <>
      <Toggle
        aria-label="Parágrafo"
        pressed={blockType === "paragraph"}
        onPressedChange={formatParagraph}
      >
        <span className="text-xs font-bold">P</span>
      </Toggle>
      <Toggle
        aria-label="Título 1"
        pressed={blockType === "h1"}
        onPressedChange={formatHeading1}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Título 2"
        pressed={blockType === "h2"}
        onPressedChange={formatHeading2}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Citação"
        pressed={blockType === "quote"}
        onPressedChange={formatQuote}
      >
        <Quote className="h-4 w-4" />
      </Toggle>
    </>
  );
}

// Plugin for text alignment
function AlignTextPlugin() {
  const [editor] = useLexicalComposerContext();
  const [alignment, setAlignment] = useState<ElementFormatType>("left");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element =
            anchorNode.getKey() === "root"
              ? anchorNode
              : anchorNode.getTopLevelElementOrThrow();

          const elementFormat = element.getFormat();
          if (elementFormat === 1) {
            setAlignment("left");
          } else if (elementFormat === 2) {
            setAlignment("center");
          } else if (elementFormat === 3) {
            setAlignment("right");
          } else if (elementFormat === 4) {
            setAlignment("justify");
          } else {
            setAlignment("left");
          }
        }
      });
    });
  }, [editor]);

  const alignLeft = () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
  };

  const alignCenter = () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
  };

  const alignRight = () => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
  };

  return (
    <>
      <Toggle
        aria-label="Alinhar à esquerda"
        onPressedChange={alignLeft}
        pressed={alignment === "left"}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Alinhar ao centro"
        onPressedChange={alignCenter}
        pressed={alignment === "center"}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Alinhar à direita"
        onPressedChange={alignRight}
        pressed={alignment === "right"}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>
    </>
  );
}

// Plugin for lists
function ListsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [listType, setListType] = useState<string | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          // Check if we are inside a list
          let listNode = null;
          let parent = anchorNode.getParent();
          while (parent !== null) {
            if (parent.getType() === "list") {
              listNode = parent;
              break;
            }
            parent = parent.getParent();
          }

          if (listNode !== null) {
            // const listType = listNode.getListType();
            setListType('');
          } else {
            setListType(null);
          }
        }
      });
    });
  }, [editor]);

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <>
      <Toggle
        aria-label="Lista não ordenada"
        onPressedChange={formatBulletList}
        pressed={listType === "bullet"}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Lista ordenada"
        onPressedChange={formatNumberedList}
        pressed={listType === "number"}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </>
  );
}

// Plugin for image insertion
function ImagesPlugin() {
  const [editor] = useLexicalComposerContext();

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                // Insert text node with image placeholder
                const textNode = $createTextNode(`[Imagem: ${file.name}]`);
                selection.insertNodes([textNode]);
              }
            });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handlePasteImage = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "clipboard-read" as PermissionName,
      });

      if (permission.state === "granted" || permission.state === "prompt") {
        const clipboardItems = await navigator.clipboard.read();

        for (const clipboardItem of clipboardItems) {
          for (const type of clipboardItem.types) {
            if (type.startsWith("image/")) {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  const textNode = $createTextNode(`[Imagem colada]`);
                  selection.insertNodes([textNode]);
                }
              });
              return;
            }
          }
        }
      }
      toast.error("Nenhuma imagem encontrada na área de transferência");
    } catch (err) {
      console.error("Erro ao acessar a área de transferência:", err);
      toast.error("Não foi possível acessar a área de transferência");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Image className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52">
        <div className="grid gap-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleImageUpload}
          >
            <Plus className="h-4 w-4 mr-2" />
            Carregar imagem
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handlePasteImage}
          >
            <FileText className="h-4 w-4 mr-2" />
            Colar da área de transferência
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Complete toolbar plugin
function ToolbarPlugin() {
  const handleSave = () => {
    toast.success("Documento salvo automaticamente");
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-slate-50 sticky top-0 z-10">
      <FormatTextPlugin />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <BlockFormatPlugin />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <ListsPlugin />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <AlignTextPlugin />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <ImagesPlugin />

      <div className="ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="flex items-center gap-1"
        >
          <Italic className="h-4 w-4" />
          Salvo
        </Button>
      </div>
    </div>
  );
}

// Component for editable content
function EditorContentEditable() {
  return (
    <ContentEditable
      className="editor-input flex-1 p-6 focus:outline-none min-h-[50vh] max-w-none overflow-auto"
      style={{ wordWrap: "break-word" }}
    />
  );
}

// Placeholder component
function Placeholder() {
  return (
    <div className="editor-placeholder absolute top-[56px] left-6 text-gray-400 pointer-events-none">
      Comece a digitar...
    </div>
  );
}

// Main rich text editor component
const RichTextEditor = forwardRef<unknown, RichTextEditorProps>((props, ref) => {
  const { initialContent = "", onAutoSave } = props;
  // const [editorState, setEditorState] = useState<EditorState | null>(null);
  const editorRef = useRef<ReturnType<typeof createEditor> | null>(null);

  // Expose methods to the parent component through the ref
  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (editorRef.current) {
        let content = "";
        editorRef.current.getEditorState().read(() => {
          content = JSON.stringify(
            editorRef.current?.getEditorState().toJSON()
          );
        });
        return content;
      }
      return "";
    },
    setContent: (content: string) => {
      if (editorRef.current && content) {
        try {
          const parsedContent = JSON.parse(content);
          const editorState = editorRef.current.parseEditorState(parsedContent);
          editorRef.current.setEditorState(editorState);
        } catch (error) {
          console.error("Failed to parse content:", error);
        }
      }
    },
    focus: () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    },
  }));

  // Initial Lexical configuration
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
    ],
    editorState: initialContent
      ? () => {
          try {
            const parsedContent = JSON.parse(initialContent);
            return parsedContent;
          } catch (error) {
            console.error("Failed to parse initial content:", error);
            return undefined;
          }
        }
      : undefined,
  };

  // Handler for editor changes
  // const handleEditorChange = (
  //   state: EditorState,
  //   editor: ReturnType<typeof createEditor>
  // ) => {
  //   setEditorState(state);

  //   // Store the editor instance
  //   if (editorRef.current !== editor) {
  //     editorRef.current = editor;
  //   }

  //   if (onChange) {
  //     // Serialize the editor state to JSON for the onChange callback
  //     const json = JSON.stringify(state.toJSON());
  //     onChange(json);
  //   }
  // };

  return (
    <div className="flex flex-col w-full border rounded">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={<EditorContentEditable />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          {onAutoSave && <AutoSavePlugin onAutoSave={onAutoSave} />}
        </div>
      </LexicalComposer>
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
