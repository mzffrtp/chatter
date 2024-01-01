import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import LayoutContext from "./context/layout-context-component";

const HomePage = lazy(() => import("./pages/home-page"));
const ChatPage = lazy(() => import("./pages/chat-page"));

function App() {
  return (
    <BrowserRouter>
      <LayoutContext>
        <Routes>
          <Route
            index
            element={
              <Suspense fallback={<>Loading...</>}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/chat"
            element={
              <Suspense fallback={<>Loading...</>}>
                <ChatPage />
              </Suspense>
            }
          />
        </Routes>
      </LayoutContext>
    </BrowserRouter>
  );
}

export default App;
