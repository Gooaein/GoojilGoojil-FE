import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/intro/introPage";

import NotFoundPage from "./pages/error/notFoundPage";
import CustomizingPage from "./pages/customize/customizingPage";
import { Header } from "./components/common/Header/Header";
import ChattingRoomPage from "./pages/chat/chattingRoomPage";
import CreateRoomPage from "./pages/createRoom/createRoomPage";
import RoomListPage from "./pages/list/roomListPage";
import SpeakerRoomPage from "./pages/speakerRoom/speakerRoomPage";

const AppRouter = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/:uuid/chattingRoom" element={<ChattingRoomPage />} />
      <Route path="/:uuid/customize" element={<CustomizingPage />} />
      <Route path="/createRoom" element={<CreateRoomPage />} />
      <Route path="/list" element={<RoomListPage />} />
      <Route path="/speakerRoom" element={<SpeakerRoomPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
