import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/intro/introPage";

import NotFoundPage from "./pages/error/notFoundPage";
import CustomizingPage from "./pages/customize/customizingPage";
import { Header } from "./components/common/Header/Header";
import ChattingRoomPage from "./pages/chat/chattingRoomPage";
import SurveyPage from "./pages/survey/surveyPage";
import LoginPage from "./pages/login/loginPage";

const AppRouter = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/chattingRoom" element={<ChattingRoomPage />} />
      <Route path="/customize" element={<CustomizingPage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
