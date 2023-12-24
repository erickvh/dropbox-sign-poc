import { HashRouter, Routes, Route } from "react-router-dom";
import { TemplatesPage } from "./pages/Templates";

import { CreatePage } from "./pages/Create";
import { SendSignaturePage } from "./pages/SendSignatures";

export const Navigation = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TemplatesPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/:id/send-signature" element={<SendSignaturePage />} />
        </Routes>
      </HashRouter>
    </>
  );
};
