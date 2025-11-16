import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Book, FileText, ListOrdered, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor as TinyMCEEditor } from "tinymce";

import { toast } from "sonner";
import LexicalEditor from "@/components/LexicalEditor";

const Notebook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notebook, setNotebook] = useState({
    id: id || "",
    title: `Caderno ${id}`,
    pages: [{ id: "1", title: "", content: "", timestamp: Date.now() }],
    currentPage: 0,
  });
  const [tableOfContents, setTableOfContents] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    // In a real app, you would fetch the notebook data from your backend
    // For now, we'll simulate loading data using localStorage
    const savedNotebook = localStorage.getItem(`notebook-${id}`);
    if (savedNotebook) {
      try {
        const parsedNotebook = JSON.parse(savedNotebook);
        setNotebook(parsedNotebook);
        setPageTitle(
          parsedNotebook.pages[parsedNotebook.currentPage]?.title || ""
        );
      } catch {
        console.error("Failed to parse notebook data");
      }
    }
  }, [id]);

  useEffect(() => {
    // Save the current page title to the notebook state
    if (pageTitle) {
      const updatedPages = [...notebook.pages];
      updatedPages[notebook.currentPage] = {
        ...updatedPages[notebook.currentPage],
        title: pageTitle,
      };

      setNotebook({
        ...notebook,
        pages: updatedPages,
      });
    }
  }, [pageTitle]);

  const saveNotebook = () => {
    // Get the current content from the editor
    if (editorRef.current) {
      const content = editorRef.current?.getContent() ?? "";

      const updatedPages = [...notebook.pages];
      updatedPages[notebook.currentPage] = {
        ...updatedPages[notebook.currentPage],
        content,
        timestamp: Date.now(),
      };

      const updatedNotebook = {
        ...notebook,
        pages: updatedPages,
      };

      setNotebook(updatedNotebook);
      localStorage.setItem(`notebook-${id}`, JSON.stringify(updatedNotebook));
      setLastSaved(new Date());
      toast.success("Caderno salvo com sucesso!");
    }
  };

  // Auto-save function
  const handleAutoSave = (content: string) => {
    // const updatedPages = [...notebook.pages];
    // updatedPages[notebook.currentPage] = {
    //   ...updatedPages[notebook.currentPage],
    //   content,
    //   timestamp: Date.now(),
    // };

    // const updatedNotebook = {
    //   ...notebook,
    //   pages: updatedPages,
    // };

    // setNotebook(updatedNotebook);
    // localStorage.setItem(`notebook-${id}`, JSON.stringify(updatedNotebook));
    setLastSaved(new Date());
  };

  const addNewPage = () => {
    // Save current page first
    if (editorRef.current) {
      const content = editorRef.current?.getContent() ?? "";

      const updatedPages = [...notebook.pages];
      updatedPages[notebook.currentPage] = {
        ...updatedPages[notebook.currentPage],
        content,
        timestamp: Date.now(),
      };

      const newPage = {
        id: String(notebook.pages.length + 1),
        title: "",
        content: "",
        timestamp: Date.now(),
      };

      setNotebook({
        ...notebook,
        pages: [...updatedPages, newPage],
        currentPage: updatedPages.length,
      });

      setPageTitle("");
      toast.success("Nova página adicionada");
    }
  };

  const goToPage = (index: number) => {
    // Save the current page before switching
    saveNotebook();

    setNotebook({
      ...notebook,
      currentPage: index,
    });

    setPageTitle(notebook.pages[index]?.title || "");
  };

  // Format the last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return "Não salvo ainda";

    // Get time difference in minutes
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "Salvo agora mesmo";
    if (diffMins === 1) return "Salvo há 1 minuto";
    if (diffMins < 60) return `Salvo há ${diffMins} minutos`;

    const hours = Math.floor(diffMins / 60);
    if (hours === 1) return "Salvo há 1 hora";
    return `Salvo há ${hours} horas`;
  };

  // Get current page content
  const getCurrentPageContent = () => {
    return notebook.pages[notebook.currentPage]?.content || "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="flex items-center justify-between p-4 bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-xl font-semibold flex items-center gap-2">
            <Book className="h-5 w-5" />
            {notebook.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-slate-400 mr-2">
            {lastSaved ? getLastSavedText() : ""}
          </div>

          <Button
            variant="outline"
            onClick={() => setTableOfContents(!tableOfContents)}
            className="bg-slate-800 hover:bg-slate-700 border-slate-700"
          >
            <ListOrdered className="h-4 w-4 mr-2" />
            Sumário
          </Button>

          <Button
            onClick={addNewPage}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Página
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Table of Contents Sidebar */}
        {tableOfContents && (
          <div className="w-64 bg-white border-r p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Sumário
            </h2>
            <ScrollArea className="h-[calc(100vh-9rem)]">
              {notebook.pages.map((page, index) => (
                <div
                  key={page.id}
                  className={`p-2 cursor-pointer rounded mb-1 flex justify-between ${
                    notebook.currentPage === index
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => goToPage(index)}
                >
                  <div className="truncate flex-1">
                    {page.title || `Página ${index + 1}`}
                  </div>
                  <div className="text-gray-500 text-sm">{index + 1}</div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

        {/* Editor Content */}
        <div className="flex-1 flex flex-col">
          {/* Page Header */}
          <div className="border-b p-4 bg-white">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Título da página"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="text-lg font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
              <div className="text-sm text-gray-500">
                Página {notebook.currentPage + 1} de {notebook.pages.length}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-auto p-4 bg-white">
            <div className="max-w-4xl mx-auto min-h-[calc(100vh-12rem)]">
              {/* <SimpleEditor /> */}
              {/* <Tiptap />
              <RichTextEditor
                ref={editorRef}
                initialContent={getCurrentPageContent()}
                onAutoSave={handleAutoSave}
              /> */}
              <LexicalEditor
                initialContent={getCurrentPageContent()}
                onAutoSave={(html) => {
                  const updatedPages = [...notebook.pages];
                  updatedPages[notebook.currentPage].content = html;
                  updatedPages[notebook.currentPage].timestamp = Date.now();

                  const updated = { ...notebook, pages: updatedPages };
                  setNotebook(updated);
                  localStorage.setItem(
                    `notebook-${id}`,
                    JSON.stringify(updated)
                  );
                  setLastSaved(new Date());
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notebook;
