import Layout from "@/layouts";
import Routers from "@/pages";
import "@/styles/index.css";

import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Layout element={<Routers />} />
    </BrowserRouter>
  );
}

export default App;
