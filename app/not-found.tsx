"use client";

import Link from "next/link";
import { Container, Card, Button } from "react-bootstrap";
import {
  FaHome,
  FaArrowLeft,
  FaCoins,
  FaSearch,
  FaTools,
} from "react-icons/fa";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.gradientWrapper}>
      <Container className={`${styles.contentWrapper} mt-5`}>
        <Card
          className="text-center shadow-lg border"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Card.Body className="p-5">
            {/* Maintenance Worker Character */}
            <div className={styles.characterContainer}>
              <svg
                viewBox="0 0 400 400"
                className={styles.maintenanceCharacter}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="#1a1f2e"
                  stroke="var(--border-color)"
                  strokeWidth="2"
                />

                {/* Maintenance Worker Body */}
                {/* Helmet */}
                <ellipse
                  cx="200"
                  cy="120"
                  rx="60"
                  ry="50"
                  fill="#4a5568"
                  className={styles.helmet}
                />
                <ellipse
                  cx="200"
                  cy="120"
                  rx="55"
                  ry="45"
                  fill="#2d3748"
                />
                {/* Visor */}
                <ellipse
                  cx="200"
                  cy="130"
                  rx="50"
                  ry="20"
                  fill="#1a202c"
                  opacity="0.6"
                />

                {/* Body */}
                <rect
                  x="150"
                  y="170"
                  width="100"
                  height="120"
                  rx="10"
                  fill="#4a5568"
                  className={styles.body}
                />
                <rect
                  x="160"
                  y="180"
                  width="80"
                  height="100"
                  rx="8"
                  fill="#2d3748"
                />

                {/* Safety Vest Strips */}
                <rect x="150" y="200" width="100" height="8" fill="#fbbf24" />
                <rect x="150" y="220" width="100" height="8" fill="#fbbf24" />
                <rect x="150" y="240" width="100" height="8" fill="#fbbf24" />

                {/* Arms */}
                <ellipse
                  cx="130"
                  cy="220"
                  rx="25"
                  ry="60"
                  fill="#4a5568"
                  className={styles.leftArm}
                />
                <ellipse
                  cx="270"
                  cy="220"
                  rx="25"
                  ry="60"
                  fill="#4a5568"
                  className={styles.rightArm}
                />

                {/* Tools - Wrench in right hand */}
                <g className={styles.wrench}>
                  <rect
                    x="280"
                    y="180"
                    width="8"
                    height="40"
                    rx="4"
                    fill="#718096"
                    transform="rotate(45 284 200)"
                  />
                  <rect
                    x="275"
                    y="175"
                    width="18"
                    height="18"
                    rx="2"
                    fill="#4a5568"
                  />
                </g>

                {/* Flashlight in left hand */}
                <g className={styles.flashlight}>
                  <rect
                    x="100"
                    y="200"
                    width="30"
                    height="12"
                    rx="6"
                    fill="#1a202c"
                  />
                  <circle cx="130" cy="206" r="6" fill="#fbbf24" opacity="0.8">
                    <animate
                      attributeName="opacity"
                      values="0.8;1;0.8"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Light beam */}
                  <ellipse
                    cx="145"
                    cy="206"
                    rx="20"
                    ry="8"
                    fill="#fbbf24"
                    opacity="0.3"
                    className={styles.lightBeam}
                  />
                </g>

                {/* Legs */}
                <rect
                  x="160"
                  y="290"
                  width="30"
                  height="60"
                  rx="5"
                  fill="#2d3748"
                  className={styles.leftLeg}
                />
                <rect
                  x="210"
                  y="290"
                  width="30"
                  height="60"
                  rx="5"
                  fill="#2d3748"
                  className={styles.rightLeg}
                />

                {/* Boots */}
                <ellipse
                  cx="175"
                  cy="360"
                  rx="25"
                  ry="15"
                  fill="#1a202c"
                />
                <ellipse
                  cx="225"
                  cy="360"
                  rx="25"
                  ry="15"
                  fill="#1a202c"
                />

                {/* 404 Sign */}
                <g className={styles.errorSign}>
                  <rect
                    x="80"
                    y="80"
                    width="80"
                    height="50"
                    rx="5"
                    fill="#dc2626"
                    stroke="#991b1b"
                    strokeWidth="2"
                  />
                  <text
                    x="120"
                    y="115"
                    fontSize="28"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                  >
                    404
                  </text>
                </g>

                {/* Floating particles */}
                <circle
                  cx="100"
                  cy="100"
                  r="3"
                  fill="#8b5cf6"
                  opacity="0.6"
                  className={styles.particle1}
                />
                <circle
                  cx="300"
                  cy="150"
                  r="2"
                  fill="#8b5cf6"
                  opacity="0.6"
                  className={styles.particle2}
                />
                <circle
                  cx="320"
                  cy="280"
                  r="2.5"
                  fill="#8b5cf6"
                  opacity="0.6"
                  className={styles.particle3}
                />
              </svg>
            </div>

            <h1 className="display-1 fw-bold mb-3" style={{ color: "#dc2626" }}>
              404
            </h1>
            <h2 className="mb-3 d-flex align-items-center justify-content-center gap-2">
              <FaTools className="text-warning" /> Halaman Tidak Ditemukan
            </h2>
            <p className="text-muted fs-5 mb-4">
              Tim maintenance kami sedang mencari halaman yang Anda cari, tetapi
              sepertinya halaman tersebut tidak ada atau telah dipindahkan.
            </p>
            <p className="text-muted small mb-4">
              Jangan khawatir! Mari kita kembali ke halaman yang tersedia.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link href="/">
                <Button
                  variant="primary"
                  size="lg"
                  className="d-inline-flex align-items-center gap-2"
                >
                  <FaHome /> Kembali ke Home
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="d-inline-flex align-items-center gap-2"
                >
                  <FaCoins /> Lihat Wishlist
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline-info"
                  size="lg"
                  className="d-inline-flex align-items-center gap-2"
                >
                  <FaSearch /> Explore Coins
                </Button>
              </Link>
              <Button
                variant="outline-secondary"
                size="lg"
                className="d-inline-flex align-items-center gap-2"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft /> Kembali
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

