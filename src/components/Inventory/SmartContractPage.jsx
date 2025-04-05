import React, { useContext, useState } from "react";
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
  CardImg,
  CardBody,
  CardTitle,
  CardFooter,
} from "reactstrap";
import { AuthContext } from "./../../context/AuthContext";
import { sendRequest } from "./../../utils/ResDbClient";
import { POST_SMART_CONTRACT } from "./../../utils/ResDbApis";
import { saveSmartContractToFirestore } from "./../../context/FirestoreContext";
import { useNavigate } from "react-router-dom";

export default function SmartContractPage() {
  const { currentUser, userKeys } = useContext(AuthContext);
  const navigate = useNavigate();
  const [byproduct, setByproduct] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const metadata = {
    signerPublicKey: userKeys?.publicKey,
    signerPrivateKey: userKeys?.privateKey,
    recipientPublicKey: userKeys?.publicKey,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!byproduct || !startDate || !endDate) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date.");
      setLoading(false);
      return;
    }

    const contractData = {
      byproduct,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    };

    try {
      await sendRequest(POST_SMART_CONTRACT(metadata, JSON.stringify(contractData)));
      await saveSmartContractToFirestore(metadata.signerPublicKey, contractData);

      setByproduct("");
      setStartDate("");
      setEndDate("");
      navigate("/inventory"); // or any other page
    } catch (err) {
      setError("Failed to save contract: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="wrapper">
      <div
        className="page-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingTop: "100px", // Pushes below the fixed navbar
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg="6" md="8">
              <Card className="card-register">
                <CardHeader>
                  <CardTitle tag="h3" className="text-center">
                    Byproduct Smart Contract
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  {error && <Alert color="danger">{error}</Alert>}
                  <Form className="form" onSubmit={handleSubmit}>
                    <Input
                      placeholder="Byproduct Name"
                      type="text"
                      value={byproduct}
                      onChange={(e) => setByproduct(e.target.value)}
                    />
                    <Input
                      style={{ marginTop: "1rem" }}
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                      style={{ marginTop: "1rem" }}
                      type="date"
                      min={today}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <CardFooter className="text-center">
                      <Button
                        disabled={loading}
                        className="btn-round"
                        color="info"
                        size="lg"
                        type="submit"
                      >
                        Submit Contract
                      </Button>
                        <Button
                          className="btn-round"
                        color="info"
                        size="lg"
                          onClick={() => navigate("/my-contracts")}
                        >
                          Show My Contracts
                        </Button>
                    </CardFooter>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
