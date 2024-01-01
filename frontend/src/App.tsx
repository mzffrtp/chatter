import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy } from "react";

const HomePage = lazy(() => import("./pages/home-page"));
const ChatPage = lazy(() => import("./pages/chat-page"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
