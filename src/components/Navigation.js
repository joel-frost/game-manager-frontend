import { Navbar, Nav, Container } from "react-bootstrap"

function Navigation() {

    return (
        <>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand href="#home">Game Manager</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/library">Home</Nav.Link>
                        <Nav.Link href="/">Login</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );


}

export default Navigation;