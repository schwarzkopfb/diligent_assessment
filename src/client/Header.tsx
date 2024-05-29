import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";

const LINKS = [
  {
    label: "GitHub repository",
    href: "https://github.com/schwarzkopfb/diligent_assessment",
  },
  {
    label: "Assessment description",
    href: "https://github.com/dil-ajanek/tech_assessment/blob/main/README.md",
  },
  {
    label: "Candidate info",
    href: "https://github.com/schwarzkopfb",
  },
];

/**
 * Header component
 * Displays the application header with logo and navigation links
 */
export default function Header() {
  return (
    <Navbar expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/">
          <Image src="/logo.svg" height="30" />
          <h3>Movie Search</h3>
        </Navbar.Brand>
        <Nav className="justify-content-end">
          {LINKS.map(({ label, href }) => (
            <Nav.Item key={label}>
              <Nav.Link href={href} target="_blank">
                {label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
}
