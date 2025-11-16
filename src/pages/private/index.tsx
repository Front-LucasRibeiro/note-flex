import NotFound from "@/components/NotFound";
import MyNotes from "@/pages/private/MyNotes";
import { Route, Routes } from "react-router-dom";
import Note from "./Note";

export function PrivateRoute() {
  return (
    <Routes>
      <Route path="/" element={<MyNotes />} />
      <Route path="/note/:id" element={<Note />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
