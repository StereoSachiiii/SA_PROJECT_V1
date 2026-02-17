import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaBookOpen } from 'react-icons/fa'

function Navbar() {
    return (
        <BootstrapNavbar
            expand="lg"
            sticky="top"
            className="bg-blue-800 shadow"
            variant="dark"
        >
            <Container fluid className="px-3">

                {/* Logo */}
                <BootstrapNavbar.Brand
                    as={Link}
                    to="/home"
                    className="d-flex align-items-center gap-2 text-4xl font-extrabold tracking-wide m-0"
                >
                    <FaBookOpen className="text-yellow-300 text-3xl" />
                    <span className="text-white">
                        Bookfair<span className="text-yellow-300">Zone</span>
                    </span>
                </BootstrapNavbar.Brand>

                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

                <BootstrapNavbar.Collapse id="basic-navbar-nav">

                    {/* LEFT SIDE LINKS */}
                    <Nav className="me-auto">

                        <Nav.Link
                            as={Link}
                            to="/home"
                            className="text-white fs-5 fw-semibold me-4"
                        >
                            Home
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/stalls"
                            className="text-white fs-5 fw-semibold me-4"
                        >
                            Stalls
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/employee"
                            className="text-white fs-5 fw-semibold"
                        >
                            Employee Portal
                        </Nav.Link>

                    </Nav>

                    {/* RIGHT SIDE BUTTON */}
                    <Button variant="outline-light">
                        Logout
                    </Button>

                </BootstrapNavbar.Collapse>

            </Container>
        </BootstrapNavbar>
    )
}

export default Navbar
