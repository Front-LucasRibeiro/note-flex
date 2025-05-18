import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { Box } from "@mui/material";

export default function Header() {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <Box className="flex items-center">
        <EventNoteIcon className="text-white mr-2" />
        <h1 className="text-white text-lg font-bold shadow-md">Note Flex</h1>
      </Box>
      <Menubar className="justify-end p-4">
        <MenubarMenu>
          <MenubarTrigger className="text-white cursor-pointer">
            Meus Cadernos
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="text-white cursor-pointer">
            Criar Caderno
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </header>
  );
}
