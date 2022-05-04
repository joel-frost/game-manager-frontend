import { Navbar, Nav, Container } from "react-bootstrap"
import logo from "./../images/logo.png"

function Navigation() {

    if (localStorage.getItem('logged_in') !== "true") {
        return (
            <>
                <Navbar bg="dark" variant="dark" fixed="top">
                    <Container>
                        <Navbar.Brand href="/library">
                            <img src={logo} width="50" height="30" className="d-inline-block align-top" alt="Logo" />
                            Game Manager</Navbar.Brand>
                        <Nav className="ml-auto">
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/signup">Sign Up</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </>
        );
    }

    return (

        <>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand href="/library">
                        <img src={logo} width="50" height="30" className="d-inline-block align-top" alt="Logo" />
                        Game Manager</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/library">Library</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>

                    </Nav>
                    <Nav className="ml-auto">
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );


}

export default Navigation;