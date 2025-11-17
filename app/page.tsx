"use client";

import Link from "next/link";
import { Container, Button, Navbar, Nav } from "react-bootstrap";
import { FaCoins, FaArrowRight, FaList, FaPlus, FaEye, FaSearch } from "react-icons/fa";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.homepageWrapper}>
      {/* Header/Navbar */}
      <Navbar
        expand="lg"
        className={`${styles.homepageNavbar} homepage-navbar`}
        style={{
          backgroundColor: "rgba(13, 17, 23, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border-color)",
          padding: "1rem 0",
        }}
      >
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2 text-white fw-bold">
            <FaCoins className="text-primary" style={{ fontSize: "1.5rem" }} />
            <span>535240143 - Axel Chrisdy</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex gap-2">
              <Link href="/explore">
                <Button
                  variant="outline-primary"
                  className="d-flex align-items-center gap-2"
                >
                  <FaSearch /> Explore
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button
                  variant="primary"
                  className="d-flex align-items-center gap-2"
                >
                  <FaList /> Wishlist
                </Button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <Container className={styles.heroContainer}>
          <div className="hero-content text-center">
            {/* Main Icon/Logo */}
            <div className={`${styles.heroIcon} mb-4`}>
              <FaCoins
                style={{ fontSize: "5rem", color: "var(--purple-primary)" }}
              />
            </div>

            {/* Title */}
            <h1 className="display-3 fw-bold mb-4 text-white">
              Coin Wishlist App
            </h1>

            {/* Description */}
            <div className="hero-description mb-5">
              <p
                className="lead fs-4 mb-3"
                style={{
                  color: "var(--text-secondary)",
                  maxWidth: "700px",
                  margin: "0 auto 1rem",
                }}
              >
                Aplikasi untuk membuat dan mengelola wishlist cryptocurrency
                Anda dengan mudah.
              </p>
              <p
                className="fs-5 mb-4"
                style={{
                  color: "var(--text-muted)",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                List coin favorit Anda, dan kelola wishlist cryptocurrency dalam
                satu tempat.
              </p>
            </div>

            {/* Features */}
            <div className="hero-features mb-5">
              <div className="row g-4 justify-content-center">
                <div className="col-md-4">
                  <div className={`${styles.featureCard} p-4 rounded`}>
                    <FaPlus
                      className="text-primary mb-3"
                      style={{ fontSize: "2rem" }}
                    />
                    <h5 className="mb-2">Tambah Coin</h5>
                    <p className="text-muted small mb-0">
                      Tambahkan coin favorit Anda ke wishlist dengan mudah
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`${styles.featureCard} p-4 rounded`}>
                    <FaList
                      className="text-primary mb-3"
                      style={{ fontSize: "2rem" }}
                    />
                    <h5 className="mb-2">Kelola Wishlist</h5>
                    <p className="text-muted small mb-0">
                      Lihat dan kelola semua coin dalam wishlist Anda
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`${styles.featureCard} p-4 rounded`}>
                    <FaEye
                      className="text-primary mb-3"
                      style={{ fontSize: "2rem" }}
                    />
                    <h5 className="mb-2">Detail Coin</h5>
                    <p className="text-muted small mb-0">
                      Lihat detail lengkap setiap coin dalam wishlist
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/wishlist">
              <Button
                variant="primary"
                size="lg"
                className={`${styles.ctaButton} d-inline-flex align-items-center gap-2 px-5 py-3`}
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  borderRadius: "8px",
                  boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.4)",
                }}
              >
                Mulai Gunakan Wishlist <FaArrowRight />
              </Button>
            </Link>

            {/* Project Info */}
            <div
              className="project-info mt-5 pt-5"
              style={{ borderTop: "1px solid var(--border-color)" }}
            >
              <p className="text-muted mb-2">
                <strong className="text-white">Topik Project:</strong> Coin
                Wishlist - Aplikasi untuk membuat wishlist cryptocurrency
              </p>
              <p className="text-muted small mb-0">
                Dibuat dengan Next.js, TypeScript, dan Bootstrap
              </p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
