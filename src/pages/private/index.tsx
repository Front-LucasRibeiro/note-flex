import NotFound from "@/components/NotFound";
import MyNotes from "@/pages/private/MyNotes";
import { Route, Routes } from "react-router-dom";

export function PrivateRoute() {
  return (
    <Routes>
      <Route path="/" element={<MyNotes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
