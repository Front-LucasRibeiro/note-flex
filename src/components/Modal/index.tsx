import { ModalType } from "@/enums/modal";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface ModalNotebookProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  type?: ModalType;
}

// TODO - implantar react hook form + zod

export default function ModalNotebook({
  open,
  onClose,
  title = "Criar Caderno",
  type,
}: ModalNotebookProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("pessoal");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");

  const handleSave = () => {
    if (name.trim()) {
      switch (type) {
        case ModalType.NOTEBOOK:
          // sendBackend({
          //   name: name.trim(),
          //   category,
          //   description: description.trim(),
          //   color,
          // });
          break;
        case ModalType.CATEGORY:
          // sendBackend({
          //   name: name.trim(),
          //   description: description.trim(),
          //   color,
          // });
          break;
        default:
        // resetFields();
      }
    }
  };

  const handleClose = () => {
    // resetFields();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Box
        className="bg-white rounded-lg p-6 max-w-md mx-auto mt-20 shadow-lg outline-none"
        sx={{
          outline: "none",
          boxShadow: 24,
        }}
      >
        <button className="flex justify-end w-full" onClick={handleClose}>
          <HighlightOffIcon className="cursor-pointer" />
        </button>

        <Typography
          variant="h6"
          component="h2"
          className="mb-4 text-gray-800"
          sx={{
            marginBottom: "12px",
            padding: 0,
            fontWeight: "normal",
            color: "inherit",
            lineHeight: "normal",
          }}
        >
          {title}
        </Typography>

        {type === ModalType.NOTEBOOK && (
          <div className="space-y-4">
            <TextField
              label="Nome do caderno"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ marginTop: "22px" }}
            />

            <TextField
              select
              label="Categoria"
              variant="outlined"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ marginTop: "22px" }}
            >
              <MenuItem value="pessoal">Pessoal</MenuItem>
              <MenuItem value="trabalho">Trabalho</MenuItem>
              <MenuItem value="estudos">Estudos</MenuItem>
              <MenuItem value="outros">Outros</MenuItem>
            </TextField>

            <TextField
              label="Descrição"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ marginTop: "22px" }}
            />

            <div className="flex items-center space-x-4 mt-4">
              <label className="text-sm text-gray-700">Cor do caderno:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 p-0 border rounded"
              />
            </div>
          </div>
        )}

        {type === ModalType.CATEGORY && (
          <div className="space-y-4">
            <TextField
              label="Nome da categoria"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ marginTop: "22px" }}
            />

            <TextField
              label="Descrição"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ marginTop: "22px" }}
            />

            <div className="flex items-center space-x-4 mt-4">
              <label className="text-sm text-gray-700">Cor da categoria:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 p-0 border rounded"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-8 gap-4">
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Salvar
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
