import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Book, FileText, ListOrdered, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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
  const editorRef = useRef<React.RefObject<null>>(null);

  useEffect(() => {
    // In a real app, you would fetch the notebook data from your backend
    // For now, we'll simulate loading data using localStorage
    const savedNotebook = localStorage.getItem(`notebook-${id}`);
    if (savedNotebook) {
      try {
        setNotebook(JSON.parse(savedNotebook));
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
  }, [notebook, pageTitle]);

  const saveNotebook = () => {
    localStorage.setItem(`notebook-${id}`, JSON.stringify(notebook));
    toast.success("Caderno salvo com sucesso!");
  };

  const addNewPage = () => {
    const newPage = {
      id: String(notebook.pages.length + 1),
      title: "",
      content: "",
      timestamp: Date.now(),
    };

    setNotebook({
      ...notebook,
      pages: [...notebook.pages, newPage],
      currentPage: notebook.pages.length,
    });

    setPageTitle("");
    toast.success("Nova página adicionada");
  };

  const handlePageContent = (content: string) => {
    const updatedPages = [...notebook.pages];
    updatedPages[notebook.currentPage] = {
      ...updatedPages[notebook.currentPage],
      content,
    };

    setNotebook({
      ...notebook,
      pages: updatedPages,
    });
  };

  const goToPage = (index: number) => {
    setNotebook({
      ...notebook,
      currentPage: index,
    });

    setPageTitle(notebook.pages[index].title || "");
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

          <Button
            variant="outline"
            onClick={saveNotebook}
            className="bg-slate-800 hover:bg-slate-700 border-slate-700"
          >
            Salvar
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
            <div className="max-w-4xl mx-auto bg-white min-h-[calc(100vh-12rem)] shadow-sm rounded-sm">
              <RichTextEditor
                ref={editorRef}
                initialContent={notebook.pages[notebook.currentPage].content}
                onChange={handlePageContent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notebook;
