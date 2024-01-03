import { ReactNode } from "react";
import "./componets/style.css";
import { Link, useLocation } from "react-router-dom";

export type AuthLayoutPropsType = {
  children: ReactNode;
};
export default function AuthLayout(props: AuthLayoutPropsType) {
  const location = useLocation();

  return (
    <div className="form-wrapper">
      <main className="form-signin">
        {props.children}
        <div className="mt-3 mb-3">
          {location.pathname === "/auth/register" ? (
            <>
              <Link
                to={"auth/login"}
                className="btn btn-outline-warning mb-3 w-100"
              >
                Already registered? Login
              </Link>
            </>
          ) : (
            <>
              <Link
                to={"auth/register"}
                className="btn btn-outline-warning w-100 mb-3"
              >
                Don´t have an account? Register!
              </Link>
              <Link to={"/"} className="btn btn-outline-danger mb-3 w-100">
                Forgot Password?
              </Link>
            </>
          )}
          <Link to={"/"} className="btn btn-outline-info w-100">
            Back to Main Page
          </Link>
        </div>
      </main>
    </div>
  );
}
