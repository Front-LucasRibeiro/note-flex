import MyNotes from "@/pages/private/MyNotes";
import { Route, Routes } from "react-router-dom";

export function PublicRoute() {
  return (
    <Routes>
      <Route path='/login' element={<MyNotes />} />
    </Routes>
  )
}