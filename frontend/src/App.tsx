import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import LayoutContext from "./context/layout-context-component";
import AuthContext from "./context/auth-context";
import { useSelector } from "react-redux";
import { RootState, appDispatch } from "./redux/store";
import { getLastRoomsAction } from "./redux/slices/room-slice";

const HomePage = lazy(() => import("./pages/home-page"));
const ChatPage = lazy(() => import("./pages/chat-page"));
const LoginPage = lazy(() => import("./pages/auth-page/login-page"));
const RegisterPage = lazy(() => import("./pages/auth-page/register-page"));
const CreateRoomPage = lazy(() => import("./pages/room-page/create-room-page"));
const ListRoomPage = lazy(() => import("./pages/room-page/list-room-page"));

function App() {
  const authState = useSelector((state: RootState) => state.authState);
  useEffect(() => {
    appDispatch(getLastRoomsAction());
  }, []);
  return (
    <BrowserRouter>
      <AuthContext>
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
            <Route path="room">
              {authState.user ? (
                <Route
                  path="createRoom"
                  element={
                    <Suspense fallback={<>Loading...</>}>
                      <CreateRoomPage />
                    </Suspense>
                  }
                />
              ) : null}
              <Route
                path="listRoom"
                element={
                  <Suspense fallback={<>Loading...</>}>
                    <ListRoomPage />
                  </Suspense>
                }
              />
            </Route>

            <Route path="/auth">
              <Route
                path="login"
                element={
                  <Suspense fallback={<>Loading...</>}>
                    <LoginPage />
                  </Suspense>
                }
              />
              <Route
                path="register"
                element={
                  <Suspense fallback={<>Loading...</>}>
                    <RegisterPage />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </LayoutContext>
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
