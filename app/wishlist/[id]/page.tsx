"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container, Card, Button, Badge, Spinner } from "react-bootstrap";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCoins,
  FaDollarSign,
  FaFileAlt,
  FaTag,
  FaHome,
} from "react-icons/fa";
import styles from "./page.module.css";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: string;
  description: string;
}

export default function CoinDetailPage() {
  const params = useParams();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/wishlist/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setCoin(null);
            return;
          }
          throw new Error("Failed to fetch coin");
        }
        const data = await response.json();
        setCoin(data);
      } catch (error) {
        console.error("Error loading coin:", error);
        setCoin(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCoin();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.gradientWrapper}>
        <Container className={`${styles.contentWrapper} mt-5`}>
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Memuat detail coin...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className={styles.gradientWrapper}>
        <Container className={`${styles.contentWrapper} mt-5`}>
          <Card
            className="text-center shadow-lg border"
            style={{ borderColor: "var(--border-color)" }}
          >
            <Card.Body className="p-5">
              <FaCoins
                className="text-muted mb-3"
                style={{ fontSize: "3rem" }}
              />
              <h3>Coin tidak ditemukan</h3>
              <p className="text-muted">
                Coin yang Anda cari tidak ada dalam wishlist.
              </p>
              <Link href="/wishlist" className="mt-3 d-inline-block">
                <Button
                  variant="primary"
                  className="d-inline-flex align-items-center gap-2"
                >
                  <FaArrowLeft /> Kembali ke Wishlist
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.gradientWrapper}>
      <Container className={`${styles.contentWrapper} mt-5 mb-5`}>
        <Card
          className="shadow-lg border"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Card.Header className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0 d-flex align-items-center gap-2">
                <FaCoins /> Detail Coin
              </h2>
            </div>
          </Card.Header>
          <Card.Body className="p-5">
            <div className="mb-4">
              <h1 className="display-4 d-flex align-items-center gap-3 mb-3">
                <FaCoins className="text-primary" /> {coin.name}
              </h1>
              <Badge
                bg="secondary"
                className="fs-6 p-2 d-inline-flex align-items-center gap-2"
              >
                <FaTag /> {coin.symbol}
              </Badge>
            </div>

            <div
              className="mb-4 p-4 rounded"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <h3 className="mb-3 d-flex align-items-center gap-2">
                <FaDollarSign className="text-primary" /> Harga
              </h3>
              <p className="fs-2 text-primary fw-bold mb-0">${coin.price}</p>
            </div>

            <div className="mb-4">
              <h3 className="mb-3 d-flex align-items-center gap-2">
                <FaFileAlt className="text-primary" /> Deskripsi
              </h3>
              <p className="fs-5" style={{ lineHeight: "1.8" }}>
                {coin.description}
              </p>
            </div>

            <div
              className="mt-4 pt-4 border-top"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Link href="/wishlist">
                <Button
                  variant="primary"
                  size="lg"
                  className="me-2 d-inline-flex align-items-center gap-2"
                >
                  <FaArrowLeft /> Kembali ke Wishlist
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="d-inline-flex align-items-center gap-2"
                >
                  <FaHome /> Kembali ke Home
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
