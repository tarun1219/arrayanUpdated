import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
  Input,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
} from "reactstrap";

export default function ContactUs() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !message) {
      setError("Please fill in all fields");
      return;
    }
    setError("");

    const subject = encodeURIComponent("Contact Us Message");
    const body = encodeURIComponent(`Message: ${message}\n\nFrom: ${email}`);
    window.location.href = `mailto:arrayan.resilientdb@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "120vh",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <Card
              style={{
                backgroundColor: "#e0e0e0", // greyish background
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <CardHeader
                style={{
                  textAlign: "center",
                  backgroundColor: "transparent",
                  borderBottom: "none",
                }}
              >
                <CardTitle tag="h3" style={{ color: "#333", marginTop: "1rem" }}>
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardBody>
                {error && <Alert color="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email ID"
                    type="email"
                    required
                    style={{
                      marginBottom: "1rem",
                      backgroundColor: "#fff",
                      color: "#333",
                      border: "none",
                      borderRadius: "4px",
                      padding: "15px",
                    }}
                  />
                  <Input
                    style={{
                      height: "600px", // Taller message box
                      backgroundColor: "#f5f5f5",
                      color: "#333",
                      border: "none",
                      borderRadius: "4px",
                      padding: "15px",
                      resize: "vertical",
                    }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                    type="textarea"
                    required
                  />
                  <CardFooter
                    style={{
                      backgroundColor: "transparent",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      type="submit"
                      style={{
                        marginTop: "1rem",
                        backgroundColor: "#3B58C8",
                        border: "none",
                        borderRadius: "4px",
                        padding: "10px 20px",
                      }}
                    >
                      Send
                    </Button>
                  </CardFooter>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
