import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
} from "@mui/x-data-grid";
import { useState } from "react";

const rows = [
  { id: 1, name: "Caderno 1" },
  { id: 2, name: "Caderno 2" },
  { id: 3, name: "Caderno 3" },
  { id: 4, name: "Caderno 4" },
  { id: 5, name: "Caderno 5" },
  { id: 6, name: "Caderno 6" },
  { id: 7, name: "Caderno 7" },
  { id: 8, name: "Caderno 8" },
  { id: 9, name: "Caderno 9" },
  { id: 10, name: "Caderno 10" },
  { id: 11, name: "Caderno 11" },
  { id: 12, name: "Caderno 12" },
  { id: 13, name: "Caderno 13" },
  { id: 14, name: "Caderno 14" },
  { id: 15, name: "Caderno 15" },
  { id: 16, name: "Caderno 16" },
  { id: 17, name: "Caderno 17" },
  { id: 18, name: "Caderno 18" },
  { id: 19, name: "Caderno 19" },
  { id: 20, name: "Caderno 20" },
];

export default function MyNotes() {
  const [search, setSearch] = useState("");

  const handleEdit = (id: GridRowId) => {
    alert(`Editando o caderno com ID: ${id}`);
  };

  const handleDelete = (id: GridRowId) => {
    alert(`Excluindo o caderno com ID: ${id}`);
  };

  const handleOpen = (id: GridRowId) => {
    alert(`Abrindo o caderno com ID: ${id}`);
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "name", headerName: "Caderno", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      type: "actions",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            onClick={() => handleEdit(params.id)}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Excluir"
            onClick={() => handleDelete(params.id)}
          />
          <GridActionsCellItem
            icon={<OpenInNewIcon />}
            label="Abrir"
            onClick={() => handleOpen(params.id)}
          />
        </>
      ),
    },
  ];

  const filteredNotebooks = rows.filter((notebook) =>
    notebook.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto h-[calc(100%-56px)] p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Cadernos</h1>
      <input
        type="text"
        placeholder="Buscar cadernos..."
        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={filteredNotebooks}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6,
              },
            },
          }}
          pageSizeOptions={[6]}
        />
      </div>
    </div>
  );
}
