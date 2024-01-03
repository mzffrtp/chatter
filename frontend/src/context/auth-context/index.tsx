import { ReactNode, createContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { AuthStateType } from "../../redux/slices/auth-slice";

export type AuthContextComponentPropsType = {
  children: ReactNode;
};
export type AuthoutContextType = {
  //
};
const AuthoutContextProvider = createContext<AuthoutContextType>({});

export default function LayoutContext(props: AuthContextComponentPropsType) {
  const authState = useSelector<RootState, AuthStateType>(
    (state) => state.authState
  );

  if (!authState.user) {
    //! token in local storage but not user
  }
  const contextValue: AuthoutContextType = {};

  return (
    <AuthoutContextProvider.Provider value={contextValue}>
      {props.children}
    </AuthoutContextProvider.Provider>
  );
}
