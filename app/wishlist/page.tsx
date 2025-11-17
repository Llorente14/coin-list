"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import Link from "next/link";
import {
  FaPlus,
  FaTrash,
  FaEye,
  FaHome,
  FaCoins,
  FaDollarSign,
  FaTag,
  FaFileAlt,
  FaList,
  FaEdit,
} from "react-icons/fa";
import styles from "./page.module.css";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: string;
  description: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState<"success" | "danger">("success");
  const [editingCoin, setEditingCoin] = useState<Coin | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load coins from API on mount
  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/wishlist");
      if (!response.ok) {
        throw new Error("Failed to fetch coins");
      }
      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
      setAlertMessage("Gagal memuat data wishlist");
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !symbol || !price) {
      setAlertMessage(
        "Mohon isi semua field yang wajib (Nama, Symbol, Harga)!"
      );
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          symbol,
          price,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create coin");
      }

      const newCoin = await response.json();
      setCoins([newCoin, ...coins]);
      setName("");
      setSymbol("");
      setPrice("");
      setDescription("");
      setAlertMessage("Coin berhasil ditambahkan ke wishlist!");
      setAlertVariant("success");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error creating coin:", error);
      setAlertMessage("Gagal menambahkan coin ke wishlist");
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus coin ini dari wishlist?")) {
      try {
        const response = await fetch(`/api/wishlist/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete coin");
        }

        setCoins(coins.filter((coin) => coin.id !== id));
        setAlertMessage("Coin berhasil dihapus dari wishlist!");
        setAlertVariant("success");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } catch (error) {
        console.error("Error deleting coin:", error);
        setAlertMessage("Gagal menghapus coin dari wishlist");
        setAlertVariant("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    }
  };

  const handleEdit = (coin: Coin) => {
    setEditingCoin(coin);
    setName(coin.name);
    setSymbol(coin.symbol);
    setPrice(coin.price);
    setDescription(coin.description);
    setShowEditModal(true);
  };

  const handleUpdateCoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCoin || !name || !symbol || !price) {
      setAlertMessage(
        "Mohon isi semua field yang wajib (Nama, Symbol, Harga)!"
      );
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const response = await fetch(`/api/wishlist/${editingCoin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          symbol,
          price,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update coin");
      }

      const updatedCoin = await response.json();
      setCoins(
        coins.map((coin) => (coin.id === editingCoin.id ? updatedCoin : coin))
      );
      setShowEditModal(false);
      setEditingCoin(null);
      setName("");
      setSymbol("");
      setPrice("");
      setDescription("");
      setAlertMessage("Coin berhasil diperbarui!");
      setAlertVariant("success");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error updating coin:", error);
      setAlertMessage("Gagal memperbarui coin");
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingCoin(null);
    setName("");
    setSymbol("");
    setPrice("");
    setDescription("");
  };

  const handleCoinClick = (id: string) => {
    router.push(`/wishlist/${id}`);
  };

  return (
    <div className={styles.gradientWrapper}>
      <Container className={`${styles.contentWrapper} mt-4 mb-5`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-4 d-flex align-items-center gap-2">
            <FaCoins className="text-primary" /> Coin Wishlist
          </h1>
          <Link href="/">
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center gap-2"
            >
              <FaHome /> Kembali ke Home
            </Button>
          </Link>
        </div>

        {showAlert && (
          <Alert
            variant={alertVariant}
            dismissible
            onClose={() => setShowAlert(false)}
            className="mb-4"
          >
            {alertMessage}
          </Alert>
        )}

        <Card
          className="mb-4 shadow-lg border"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Card.Header
            as="h5"
            className="bg-primary text-white d-flex align-items-center gap-2"
          >
            <FaPlus /> Tambah Coin ke Wishlist
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleAddCoin}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <FaCoins /> Nama Coin *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Contoh: Bitcoin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <FaTag /> Symbol *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Contoh: BTC"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <FaDollarSign /> Harga (USD) *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Contoh: 50000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <FaFileAlt /> Deskripsi
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Deskripsi coin (opsional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="primary"
                type="submit"
                className="w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <FaPlus /> Tambah ke Wishlist
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <h2 className="mb-3 d-flex align-items-center gap-2">
          <FaList /> Daftar Coin Wishlist
        </h2>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3 text-muted">Memuat wishlist...</p>
          </div>
        ) : coins.length === 0 ? (
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
                Wishlist masih kosong. Tambahkan coin pertama Anda!
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {coins.map((coin) => (
              <Col key={coin.id} md={6} lg={4} className="mb-3">
                <Card
                  className="h-100 shadow-sm border"
                  style={{
                    cursor: "pointer",
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
                    <Card.Title className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h4 className="d-flex align-items-center gap-2">
                          <FaCoins className="text-primary" /> {coin.name}
                        </h4>
                        <span className="badge bg-secondary mt-2">
                          {coin.symbol}
                        </span>
                      </div>
                      <div className="d-flex gap-1">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(coin);
                          }}
                          className="d-flex align-items-center gap-1"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(coin.id);
                          }}
                          className="d-flex align-items-center gap-1"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Card.Title>
                    <Card.Text className="mb-2">
                      <strong className="d-flex align-items-center gap-2">
                        <FaDollarSign className="text-primary" /> Harga:
                      </strong>{" "}
                      ${coin.price}
                    </Card.Text>
                    <Card.Text className="text-muted small mb-3">
                      {coin.description.length > 50
                        ? `${coin.description.substring(0, 50)}...`
                        : coin.description}
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleCoinClick(coin.id)}
                    >
                      <FaEye /> Lihat Detail
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center gap-2">
              <FaEdit /> Edit Coin
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateCoin}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <FaCoins /> Nama Coin *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Contoh: Bitcoin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <FaTag /> Symbol *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Contoh: BTC"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <FaDollarSign /> Harga (USD) *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Contoh: 50000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center gap-2">
                      <FaFileAlt /> Deskripsi
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Deskripsi coin (opsional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  onClick={handleCloseEditModal}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="d-flex align-items-center gap-2"
                >
                  <FaEdit /> Simpan Perubahan
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}
