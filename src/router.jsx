import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/intro/introPage";

import NotFoundPage from "./pages/error/notFoundPage";
import ChattingPage from "./pages/chat/chattingPage";
import CustomizingPage from "./pages/customize/customizingPage";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/chat" element={<ChattingPage />} />
      <Route path="/customize" element={<CustomizingPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
