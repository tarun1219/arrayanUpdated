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
  CardBody,
  CardTitle,
  CardFooter,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { AuthContext } from "./../../context/AuthContext";
import { sendRequest } from "./../../utils/ResDbClient";
import { POST_TRANSACTION } from "./../../utils/ResDbApis";
import {
  saveSmartContractToFirestore,
  fetchSmartContractsFromFirestore,
} from "./../../context/FirestoreContext";
import { useNavigate } from "react-router-dom";

export default function SmartContractPage() {
  const { currentUser, userKeys } = useContext(AuthContext);
  const navigate = useNavigate();
  const [byproduct, setByproduct] = useState("");
  const [source, setSource] = useState(""); // New state for source
  const [product, setProduct] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;

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

  // Ensure all required fields (byproduct, source, startDate, endDate) are provided
  if (!byproduct || !source || !startDate || !endDate || !product) {
    setError("All fields are required.");
    setLoading(false);
    return;
  }

  if (startDate > endDate) {
    setError("Start date cannot be after end date.");
    setLoading(false);
    return;
  }

  // Build the data object and add a Timestamp
  const dataItem = {
    byproduct,
    source,
    product, // Include source in the data object
    startDate,
    endDate,
    Timestamp: new Date(),
  };

  try {
    const assetData = JSON.stringify(dataItem)
                            .replace(/"([^"]+)":/g, '$1:')
                            .replace(/,(\s*[}\]])/g, '$1');
    const mutationQuery = POST_TRANSACTION(metadata, assetData);
    const res = await sendRequest(mutationQuery);
    const transactionId = res?.data?.postTransaction?.id;

    // Save the smart contract to Firestore
    await saveSmartContractToFirestore(metadata.signerPublicKey, dataItem);

    // Reset form fields
    setByproduct("");
    setSource("");
    setStartDate("");
    setEndDate("");
    setProduct("");

    // Optionally, fetch contracts to update the table
    const fetchedContracts = await fetchSmartContractsFromFirestore(
      metadata.signerPublicKey
    );
    setContracts(fetchedContracts);
    setCurrentPage(1);
  } catch (err) {
    setError("Failed to save contract: " + err.message);
  }

  setLoading(false);
};


  const handleShowContracts = async () => {
    try {
      const fetchedContracts = await fetchSmartContractsFromFirestore(
        metadata.signerPublicKey
      );
      setContracts(fetchedContracts);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching smart contracts:", error);
      setError("Error fetching smart contracts");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(contracts.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = contracts.slice(indexOfFirstEntry, indexOfLastEntry);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="wrapper">
      <div
        className="page-header"
        style={{
          display: "flex",
          flexDirection: "column",       // Stack content vertically
          alignItems: "center",
          justifyContent: "flex-start",  // Align content at the top
          minHeight: "100vh",
          paddingTop: "100px",
          overflowY: "auto",             // Enable scrolling if content exceeds viewport height
        }}
      >
        <Container className="pt-5 pb-5">
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
                      placeholder="Product"
                      type="text"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      style={{ marginTop: "1rem" }}
                    />
                    <Input
                      placeholder="Byproduct Name"
                      type="text"
                      value={byproduct}
                      onChange={(e) => setByproduct(e.target.value)}
                    />
                    {/* New input field for source */}
                    <Input
                      placeholder="Source"
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      style={{ marginTop: "1rem" }}
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
                        onClick={handleShowContracts}
                      >
                        Show My Contracts
                      </Button>
                    </CardFooter>
                  </Form>
                  </CardBody>
                  </Card>
                  </Col>
                  <Col lg="11" md="20">
                  {/* Dark-themed, paginated table */}
                    {contracts && contracts.length > 0 && (
                      <div className="mt-4">
                        <Table className="align-items-center table-dark table-flush">
                          <thead className="thead-dark">
                            <tr>
                              <th className="text-center" style={{ padding: "1rem", color: "white" }}>Product</th>
                              <th className="text-center" style={{ padding: "1rem", color: "white" }}>Byproduct</th>
                              <th className="text-center" style={{ padding: "1rem", color: "white" }}>Source</th>
                              <th className="text-center" style={{ padding: "1rem", color: "white" }}>Start Date</th>
                              <th className="text-center" style={{ padding: "1rem", color: "white" }}>End Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentEntries.map((contract, index) => (
                              <tr key={index}>
                                <td className="text-center" style={{ padding: "1rem", color: "white" }}>
                                  {contract.product || "-"}
                                </td>
                                <td className="text-center" style={{ padding: "1rem", color: "white" }}>
                                  {contract.byproduct || "-"}
                                </td>
                                <td className="text-center" style={{ padding: "1rem", color: "white" }}>
                                  {contract.source || "-"}
                                </td>
                                <td className="text-center" style={{ padding: "1rem", color: "white" }}>
                                  {contract.startDate || "-"}
                                </td>
                                <td className="text-center" style={{ padding: "1rem", color: "white" }}>
                                  {contract.endDate || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <Pagination
                          className="pagination justify-content-center"
                          listClassName="justify-content-center"
                          style={{ marginTop: "1rem" }}
                        >
                          <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink onClick={() => handlePageChange(currentPage - 1)} previous />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, index) => (
                            <PaginationItem active={index + 1 === currentPage} key={index}>
                              <PaginationLink onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink onClick={() => handlePageChange(currentPage + 1)} next />
                          </PaginationItem>
                        </Pagination>
                      </div>
                    )}       
                  </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
