import React, { useContext, useEffect, useState } from "react";
import * as xlsx from "xlsx";
import {
  Input,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Container,
  Form,
} from "reactstrap";
import { POST_TRANSACTION, GET_TRANSACTION } from "./../../utils/ResDbApis";
import { sendRequest } from "./../../utils/ResDbClient";
import { AuthContext } from "./../../context/AuthContext";
import {
  saveTransactionsToFirestore,
  fetchUserTransactionIds,
} from "./../../context/FirestoreContext";
import { useNavigate } from "react-router-dom";
import InventoryTable from "./InventoryTable";

function DataUploader() {
  const { currentUser, userKeys } = useContext(AuthContext);
  const navigate = useNavigate();
  const initialFormState = {
    outputProducts: "",
    byProducts: "",
    timestamp: "",
    inputProduct: "",
    productQuantity: "",
    byproductQuantity: "",
    industry: "",
  };

  const ALLOWED_FILE_TYPES = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  const metadata = {
    signerPublicKey: userKeys?.publicKey,
    signerPrivateKey: userKeys?.privateKey,
    recipientPublicKey: userKeys?.publicKey,
  };

  const [forms, setForms] = useState([initialFormState]);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");
  const [uploadState, setUploadState] = useState("");
  const [txnIds, setTxnIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      if (Array.isArray(txnIds) && txnIds.length > 0) {
        console.log(txnIds);
        setLoading(true);
        let json = [];
        try {
          for (const id of txnIds) {
            const res = await sendRequest(GET_TRANSACTION(id));
            if (res && res.data) {
              let info = res.data.getTransaction.asset.data;
              json.push(info);;
            }
          }
          setInventory(json);
        } catch (error) {
          console.log("Fetch Inventory error", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInventory();
  }, [txnIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    document
      .getElementById("inventory-section")
      .scrollIntoView({ behavior: "smooth" });
    fetchTxn();
  };

  const handleInputChange = (index, fieldName, value) => {
    const newForms = [...forms];
    newForms[index][fieldName] = value;
    setForms(newForms);
  };

  const fetchTxn = async () => {
    const ids = await fetchUserTransactionIds(metadata.signerPublicKey);
    setTxnIds(Array.isArray(ids) ? ids : []);
  };

  const handleAddForm = () => {
    setForms([...forms, { ...initialFormState }]);
  };

  const handleSaveData = async () => {
    const jsonData = JSON.parse(JSON.stringify(forms, null, 2));
    let txnData = {};
    let monthlyTransactionCounts = {};
    const promises = jsonData.map(async (dataItem) => {
      dataItem["Timestamp"] = new Date(dataItem["Timestamp"]);
      console.log("stringify JSON ", JSON.stringify(dataItem));

      const res = await sendRequest(
        POST_TRANSACTION(metadata, JSON.stringify(dataItem))
      );

      const industry = dataItem["Industry"];
      const transactionId = res?.data?.postTransaction?.id;
      if (transactionId) {
        if (!txnData[industry]) {
          txnData[industry] = [];
        }
        txnData[industry].push(transactionId);
        const yearMonth = `${dataItem["Timestamp"].getFullYear()}-${String(
          dataItem["Timestamp"].getMonth() + 1
        ).padStart(2, "0")}`;
        if (!monthlyTransactionCounts[yearMonth]) {
          monthlyTransactionCounts[yearMonth] = {
            txnCount: 0,
            products: new Set(),
          };
        }
        monthlyTransactionCounts[yearMonth].txnCount += 1;
        monthlyTransactionCounts[yearMonth].products.add(industry);
      }
    });

    await Promise.all(promises);

    for (const key in monthlyTransactionCounts) {
      monthlyTransactionCounts[key].products = Array.from(
        monthlyTransactionCounts[key].products
      );
    }
    await saveTransactionsToFirestore(
      metadata.signerPublicKey,
      txnData,
      monthlyTransactionCounts
    );

    await fetchTxn();
  };

  const readExcel = async (e) => {
    e.preventDefault();
    let selectedFile = e.target.files[0];
    if (selectedFile && ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      const reader = new FileReader();
      let txnData = {};
      let monthlyTransactionCounts = {};
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet, {
          raw: false,
          dateNF: "yyyy-mm-ddTHH:MM:ss.000Z",
        });

        const promises = json.map(async (dataItem) => {
          dataItem["Timestamp"] = new Date(dataItem["Timestamp"]);
          const assetData = JSON.stringify(dataItem)
                            .replace(/"([^"]+)":/g, '$1:')
                            .replace(/,(\s*[}\]])/g, '$1');
          const mutationQuery = POST_TRANSACTION(metadata, assetData);
          const res = await sendRequest(mutationQuery);

          const industry = dataItem["Industry"];
          const transactionId = res?.data?.postTransaction?.id;
          if (transactionId) {
            if (!txnData[industry]) {
              txnData[industry] = [];
            }
            txnData[industry].push(transactionId);
            const yearMonth = `${dataItem["Timestamp"].getFullYear()}-${String(
              dataItem["Timestamp"].getMonth() + 1
            ).padStart(2, "0")}`;
            if (!monthlyTransactionCounts[yearMonth]) {
              monthlyTransactionCounts[yearMonth] = {
                txnCount: 0,
                products: new Set(),
              };
            }
            monthlyTransactionCounts[yearMonth].txnCount += 1;
            monthlyTransactionCounts[yearMonth].products.add(industry);
          }
        });

        await Promise.all(promises);

        for (const key in monthlyTransactionCounts) {
          monthlyTransactionCounts[key].products = Array.from(
            monthlyTransactionCounts[key].products
          );
        }

        await saveTransactionsToFirestore(
          metadata.signerPublicKey,
          txnData,
          monthlyTransactionCounts
        );
        await fetchTxn();
      };

      reader.readAsBinaryString(selectedFile);
    } else {
      setError("Please select only Excel files");
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="page-header">
          <div className="content-center">
            <Row className="row-grid justify-content-between align-items-center text-left">
              <Col lg="6" md="6">
                <h1 className="text-white">
                  We believe in food <br />
                  <span className="text-white">integrity</span>
                </h1>
                <p className="text-white mb-3">
                  The whole is the sum of its parts. Track your supply chain
                  across all stages of product creation.
                </p>
              </Col>
              <Col lg="4" md="5">
                <img
                  alt="..."
                  className="img-fluid"
                  src={require("../../assets/img/inventory.png")}
                />
              </Col>
            </Row>

            {uploadState === "" && (
              <Row className="justify-content-between">
                <Col>
                  <Button
                    color="info"
                    href="#upload"
                    onClick={() => setUploadState("Excel")}
                  >
                    <i className="tim-icons icon-attach-87" /> Upload Excel
                  </Button>
                </Col>
                <Col>
                  <Button
                    color="info"
                    onClick={() => setUploadState("Form")}
                  >
                    <i className="tim-icons icon-bullet-list-67" /> Fill
                    Manually
                  </Button>
                </Col>
              </Row>
            )}

            <Row style={{ marginTop: "2rem" }}>
              <Container>
                <Row className="justify-content-between">
                  <Col>
                    {uploadState === "Excel" ? (
                      <Card>
                        <CardBody>
                          <Input
                            type="file"
                            onChange={readExcel}
                            disabled={!currentUser}
                          />
                          {error && (
                            <h4 className="text-danger text-center">{error}</h4>
                          )}
                        </CardBody>
                      </Card>
                    ) : uploadState === "Form" ? (
                      <Form>
                        {forms.map((form, index) => (
                          <Row
                            key={index}
                            className="mb-3 justify-content-between"
                          >
                            {Object.keys(initialFormState).map((key) => (
                              <Col key={key}>
                                <Input
                                  placeholder={key}
                                  type="text"
                                  value={form[key]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      key,
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                            ))}
                          </Row>
                        ))}
                        <Button
                          className="btn-simple"
                          color="info"
                          onClick={handleAddForm}
                        >
                          Add
                        </Button>
                        <Button color="info" onClick={handleSaveData}>
                          Save Data
                        </Button>
                      </Form>
                    ) : null}

                    <div className="btn-wrapper mt-3">
                      {!currentUser ? (
                        <Button
                          className="btn-simple"
                          color="info"
                          onClick={() => navigate("/login")}
                        >
                          <i className="tim-icons icon-badge" /> Please log in
                          to view/upload inventory
                        </Button>
                      ) : (
                        <Button
                          className="btn-simple"
                          color="info"
                          onClick={handleSubmit}
                        >
                          <i className="tim-icons icon-notes" /> Display My
                          Inventory
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </div>
        </div>

        <div className="section" id="inventory-section">
          <Container>
            {inventory.length > 0 ? (
              <InventoryTable inventory={inventory} />
            ) : loading ? (
              <div className="loading-indicator text-white text-center">
                <p>Fetching your inventory...</p>
              </div>
            ) : (
              <div className="w-100 text-center mt-2 text-white">
                No inventory found!
              </div>
            )}
          </Container>
        </div>
      </div>
    </>
  );
}

export default DataUploader;
