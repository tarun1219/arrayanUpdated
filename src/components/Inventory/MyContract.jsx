import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Spinner,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { AuthContext } from "./../../context/AuthContext";
import { firestoreDB } from "./../../auth/firebaseAuthSDK";

export default function MyContract() {
  const { userKeys } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchContracts = async () => {
      if (!userKeys?.publicKey) return;

      try {

        const snapshot = await firestoreDB
          .collection("smartContracts")
          .where("signerPublicKey", "==", userKeys.publicKey)
          .get();

        const filteredContracts = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.endDate >= today) {
            filteredContracts.push({ id: doc.id, ...data });
          }
        });

        setContracts(filteredContracts);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [userKeys, today]);

  return (
    <div
      className="wrapper"
      style={{
        paddingTop: "100px", 
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg="10" md="12">
            <Card className="shadow">
              <CardBody>
                <CardTitle tag="h2" className="text-center mb-4">
                  My Active Smart Contracts
                </CardTitle>
                {loading ? (
                  <div className="text-center">
                    <Spinner color="info" />
                  </div>
                ) : contracts.length === 0 ? (
                  <p className="text-center text-muted">
                    No active contracts found.
                  </p>
                ) : (
                  <Table striped bordered responsive>
                    <thead>
                      <tr>
                        <th>Byproduct</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract, index) => (
                        <tr key={index}>
                          <td>{contract.byproduct}</td>
                          <td>{contract.startDate}</td>
                          <td>{contract.endDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
