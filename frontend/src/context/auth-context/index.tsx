import { ReactNode, createContext } from "react";
import { useSelector } from "react-redux";
import { RootState, appDispatch } from "../../redux/store";
import {
  AuthStateType,
  getUserMeInfoAction,
} from "../../redux/slices/auth-slice";

export type AuthContextComponentPropsType = {
  children: ReactNode;
};
export type AuthoutContextType = {
  //
};
const AuthoutContextProvider = createContext<AuthoutContextType>({});

export default function AuthContext(props: AuthContextComponentPropsType) {
  const authState = useSelector<RootState, AuthStateType>(
    (state) => state.authState
  );

  if (authState.token && !authState.user) {
    appDispatch(getUserMeInfoAction());
  }
  const contextValue: AuthoutContextType = {};

  return (
    <AuthoutContextProvider.Provider value={contextValue}>
      {props.children}
    </AuthoutContextProvider.Provider>
  );
}
