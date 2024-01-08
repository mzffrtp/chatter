import { Link } from "react-router-dom";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Button,
  NavDropdown,
  Dropdown,
  SplitButton,
  DropdownButton,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState, appDispatch } from "../../redux/store";
import { AuthStateType, logoutAction } from "../../redux/slices/auth-slice";
import "./style.css";
import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";

export default function Header() {
  const authState = useSelector<RootState, AuthStateType>(
    (state) => state.authState
  );

  const { width } = useWindowSize();
  const [dropDirection, setDropDirection] = useState("down");
  const [mbClass, setMbClass] = useState("");

  useEffect(() => {
    setDropDirection(width < 992 ? "right" : "down");
    setMbClass(width < 992 ? "mb-3" : "mx-3");
  }, [width]);

  return (
    <header className="text-center">
      <Navbar expand="lg" className="bg-dark" variant="dark">
        <Container>
          <Link to="/" className="navbar-brand">
            <i className="fa-sharp fa-solid fa-link me-3" />
            <strong>Chatteria</strong>
          </Link>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav" className="justify-content-end">
            <Nav className="mr-auto">
              <Link
                to="/"
                className="nav-link text-white btn btn-outline-info mb-1"
              >
                <i className="fa-sharp fa-solid fa-link me-1" />
                <strong>Home</strong>
              </Link>
              <div>
                <SplitButton
                  id="dropdown-button-drop"
                  drop={dropDirection}
                  variant="info"
                  title="Room"
                  className={mbClass}
                >
                  <Dropdown.Item eventKey="1">
                    <Link to="/room/listRoom" className="dropdown-item">
                      List Rooms
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="2">
                    <Link to="/room/createRoom" className="dropdown-item">
                      Create Room
                    </Link>
                  </Dropdown.Item>
                </SplitButton>
              </div>
              {authState.user ? (
                <Form className="d-flex justify-content-center mb-1">
                  <Link to="/user/profile" className="btn btn-outline-warning">
                    {authState.user.username}
                  </Link>
                  <Button
                    variant="outline-danger mx-3"
                    onClick={(e) => {
                      if (confirm("Wamt to logout?")) {
                        appDispatch(logoutAction());
                      }
                    }}
                  >
                    Logout
                  </Button>
                </Form>
              ) : (
                <NavDropdown
                  title="Auth"
                  id="basic-nav-dropdown"
                  className="mb-3"
                >
                  <NavDropdown.Item href="auth/login">
                    <i className="fa-sharp fa-solid fa-link me-3" />
                    <strong>Login</strong>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="auth/register">
                    <i className="fa-sharp fa-solid fa-link me-3" />
                    <strong>Register</strong>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
