import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <BootstrapNavbar
            expand="lg"
            sticky="top"
            className="bg-blue-800 shadow"
            variant="dark"
        >
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">
                    BookFair
                </BootstrapNavbar.Brand>

                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/home">
                            Home
                        </Nav.Link>

                        <Nav.Link as={Link} to="/stalls">
                            Stalls
                        </Nav.Link>

                        <Nav.Link as={Link} to="/employee">
                            Employee Portal
                        </Nav.Link>
                    </Nav>

                    <Button variant="outline-light">
                        Logout
                    </Button>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    )
}

export default Navbar
