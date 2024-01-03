import { FormEvent } from "react";
import { RootState, appDispatch } from "../../../redux/store";
import {
  AuthLoginDataType,
  AuthStateType,
  loginAction,
} from "../../../redux/slices/auth-slice";
import { useSelector } from "react-redux";
import "./components/style.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const authState = useSelector<RootState, AuthStateType>(
    (state) => state.authState
  );

  const navigate = useNavigate();

  if (authState.user) {
    navigate("/");
  }

  console.log("authState-->", authState);

  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const value = Object.fromEntries(data.entries());
    appDispatch(loginAction(value as AuthLoginDataType));
  }
  return (
    <>
      {authState.requestStatus === "pending" ? (
        <button
          className="btn btn-primary loading-overlay"
          type="button"
          disabled
        >
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </button>
      ) : (
        <form onSubmit={onFormSubmit}>
          <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Username"
            />
            <label htmlFor="floatingInput">Username</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            <i className="fa-regular fa-paper-plane me-3" />
            Sign in
          </button>
        </form>
      )}
    </>
  );
}
