import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { ModalType } from "@/enums/modal";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { Box } from "@mui/material";
import { useState } from "react";
import ModalNotebook from "../Modal";

export default function Header() {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<ModalType>(ModalType.NOTEBOOK);
  const [titleModal, setTitleModal] = useState<string>("");

  const dataMenu = [
    {
      name: "Meus Cadernos",
      clickAction: () => {},
    },
    {
      name: "Criar Caderno",
      clickAction: () => {
        setModalIsOpen(true);
        setType(ModalType.NOTEBOOK);
        setTitleModal("Criar caderno");
      },
    },
    {
      name: "Criar Categoria",
      clickAction: () => {
        setModalIsOpen(true);
        setType(ModalType.CATEGORY);
        setTitleModal("Criar categoria");
      },
    },
  ];

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <Box className="flex items-center">
        <EventNoteIcon className="text-white mr-2" />
        <h1 className="text-white text-lg font-bold shadow-md">Note Flex</h1>
      </Box>
      <Menubar className="justify-end p-4">
        {dataMenu.map((data) => (
          <MenubarMenu>
            <MenubarTrigger
              className="text-white cursor-pointer"
              onClick={data.clickAction}
            >
              {data.name}
            </MenubarTrigger>
          </MenubarMenu>
        ))}

        <ModalNotebook
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          type={type}
          title={titleModal}
        />
      </Menubar>
    </header>
  );
}
