"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  InputGroup,
  Form,
} from "react-bootstrap";
import Link from "next/link";
import {
  FaCoins,
  FaHome,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaList,
} from "react-icons/fa";
import styles from "./page.module.css";

interface CoinGeckoCoin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  image: string;
}

export default function ExplorePage() {
  const [coins, setCoins] = useState<CoinGeckoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false",
        {
          headers: {
            "x-cg-demo-api-key": "CG-p67wghz7BRNAS35wp1y63USq",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch coins");
      }

      const data = await response.json();
      setCoins(data);
    } catch (err) {
      setError("Gagal memuat data dari CoinGecko API");
      console.error("Error fetching coins:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.gradientWrapper}>
      <Container className={`${styles.contentWrapper} mt-4 mb-5`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-4 d-flex align-items-center gap-2">
            <FaCoins className="text-primary" /> Explore Cryptocurrencies
          </h1>
          <div className="d-flex gap-2">
            <Link href="/wishlist">
              <Button
                variant="outline-primary"
                className="d-flex align-items-center gap-2"
              >
                <FaList /> Wishlist
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2"
              >
                <FaHome /> Home
              </Button>
            </Link>
          </div>
        </div>

        <Card
          className="mb-4 shadow-lg border"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Card.Body>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Cari cryptocurrency (nama atau symbol)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
            <Button
              variant="outline-danger"
              size="sm"
              className="ms-3"
              onClick={fetchCoins}
            >
              Coba Lagi
            </Button>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Memuat data cryptocurrency...</p>
          </div>
        ) : filteredCoins.length === 0 ? (
          <Card
            className="text-center p-5 shadow-lg border"
            style={{ borderColor: "var(--border-color)" }}
          >
            <Card.Body>
              <FaCoins
                className="text-muted mb-3"
                style={{ fontSize: "3rem" }}
              />
              <p className="fs-5 text-muted">
                Tidak ada cryptocurrency yang ditemukan.
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {filteredCoins.map((coin) => (
              <Col key={coin.id} md={6} lg={4} className="mb-3">
                <Card
                  className="h-100 shadow-sm border"
                  style={{
                    borderColor: "var(--border-color)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(139, 92, 246, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      {coin.image && (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          style={{ width: "48px", height: "48px" }}
                        />
                      )}
                      <div className="flex-grow-1">
                        <Card.Title className="mb-1">
                          {coin.name}
                        </Card.Title>
                        <span className="badge bg-secondary">
                          {coin.symbol.toUpperCase()}
                        </span>
                        {coin.market_cap_rank && (
                          <span className="badge bg-info ms-2">
                            #{coin.market_cap_rank}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FaDollarSign className="text-primary" />
                        <strong className="fs-4">
                          ${coin.current_price.toLocaleString()}
                        </strong>
                      </div>
                      <div
                        className={`d-flex align-items-center gap-1 ${
                          coin.price_change_percentage_24h >= 0
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )}
                        <span>
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

