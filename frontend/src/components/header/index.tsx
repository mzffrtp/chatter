import { Link } from "react-router-dom";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Button,
  NavDropdown,
} from "react-bootstrap";

export default function Header() {
  return (
    <header className="text-center">
      <Navbar expand="lg" className="bg-dark" variant="dark">
        <Container fluid>
          <Link to="/" className="navbar-brand">
            <i className="fa-sharp fa-solid fa-link me-3" />
            <strong>Chatteria</strong>
          </Link>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav" className="justify-content-end">
            <Nav className="mr-auto">
              <Link to="/" className="nav-link text-white btn btn-outline-info">
                <i className="fa-sharp fa-solid fa-link me-3" />
                <strong>Home</strong>
              </Link>
              <Link
                to="/chat"
                className="nav-link text-white btn btn-outline-warning"
              >
                <i className="fa-sharp fa-solid fa-link me-3" />
                <strong>Chat</strong>
              </Link>
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
