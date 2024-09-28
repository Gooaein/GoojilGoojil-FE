import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/intro/introPage";
import NotFoundPage from "./pages/error/notFoundPage";
import CustomizingPage from "./pages/customize/customizingPage";
import { Header } from "./components/common/Header/Header";
import ChattingRoomPage from "./pages/chat/chattingRoomPage";
import SpeakerRoomPage from "./pages/speakerRoom/speakerRoomPage";
import SurveyPage from "./pages/survey/surveyPage";
import LoginPage from "./pages/login/loginPage";
import CreateRoomPage from "./pages/createRoom/createRoomPage";
import RoomListPage from "./pages/list/roomListPage";
import { StompProvider } from "./context/StompContext";
import IntroducePage from "./pages/introduce/introduce";

const StompWrappedChattingRoom = () => (
  <StompProvider>
    <ChattingRoomPage />
  </StompProvider>
);

const StompWrappedSpeakerRoom = () => (
  <StompProvider>
    <SpeakerRoomPage />
  </StompProvider>
);

const AppRouter = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/chattingRoom" element={<StompWrappedChattingRoom />} />
      <Route path="/speakerRoom" element={<StompWrappedSpeakerRoom />} />
      <Route path="/customize" element={<CustomizingPage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/:uuid/chattingRoom"
        element={<StompWrappedChattingRoom />}
      />
      <Route path="/:uuid/customize" element={<CustomizingPage />} />
      <Route path="/createRoom" element={<CreateRoomPage />} />
      <Route path="/introduce" element={<IntroducePage />} />
      <Route path="/list" element={<RoomListPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
