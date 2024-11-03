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
  Table,
} from "reactstrap";
import { POST_TRANSACTION, FETCH_TRANSACTION } from "./../../utils/ResDbApis";
import { sendRequest } from "./../../utils/ResDbClient";
import { AuthContext, saveTransactionsToFirestore } from "./../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import InventoryTable from "./InventoryTable";

function DataUploader() {
  const {currentUser, userKeys} = useContext(AuthContext);
  const navigate = useNavigate();
  const initialFormState = {
    outputProducts: '',
    byProducts: '',
    timestamp: '',
    inputProduct: '',
    productQuantity: '',
    byproductQuantity: '',
    industry: '',
  };

  const ALLOWED_FILE_TYPES = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  const metadata = {
    signerPublicKey: userKeys?.publicKey,
    signerPrivateKey: userKeys?.privateKey,
    recipientPublicKey: process.env.REACT_APP_ADMIN_PUBLIC_KEY,
  };

  const [forms, setForms] = useState([initialFormState]);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");
  const [uploadState, setUploadState] = useState("");
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    console.log("Fetching inventory...", userKeys);
    const query = FETCH_TRANSACTION(
      metadata.signerPublicKey,
      metadata.recipientPublicKey
    );
    try {
      await sendRequest(query).then((res) => {
        if (res && res.data && res.data.getFilteredTransactions) {
          let json = [];
          res.data.getFilteredTransactions.forEach((item) => {
            json.push(JSON.parse(item.asset.replace(/'/g, '"')).data);
          });
          setInventory(json);
        } else {
          // fetchInventory(); // BUG: Temporary fix for the intermittent graphql error
        }
      });
    } catch (error) {
      console.log("Fetch Inventory error ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document
      .getElementById("inventory-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (index, fieldName, value) => {
    const newForms = [...forms];
    newForms[index][fieldName] = value;
    setForms(newForms);
  };

  
  const handleAddForm = () => {
    setForms([...forms, { ...initialFormState }]);
  };

  const handleSaveData = async () => {
    // Convert forms data to JSON format
    const jsonData = JSON.parse(JSON.stringify(forms, null, 2));
    let txnData = {};
    const promises = jsonData.map(async (dataItem) => {
      dataItem["Timestamp"] = new Date(dataItem["Timestamp"]);
      const res = await sendRequest(
        POST_TRANSACTION(metadata, JSON.stringify(dataItem))
      );

      console.log("Inventory added successfully ", res);

      const industry = dataItem["Industry"];
      const transactionId = res?.data?.postTransaction?.id;
      if (transactionId) {
        if (!txnData[industry]) {
          txnData[industry] = [];
        }
        txnData[industry].push(transactionId);
      }
      
    });

    await Promise.all(promises);
    await saveTransactionsToFirestore(txnData);

    fetchInventory();
  };

  const readExcel = async (e) => {
    e.preventDefault();
    let selectedFile = e.target.files[0];
    if (selectedFile && ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      document
      .getElementById("inventory-section")
      .scrollIntoView({ behavior: "smooth" });
      const reader = new FileReader();
      let txnData = {};
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "json" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet, { raw: false, dateNF: "yyyy-mm-ddTHH:MM:ss.000Z" });
        const promises = json.map(async (dataItem) => {
          dataItem["Timestamp"] = new Date(dataItem["Timestamp"]);
          const res = await sendRequest(
            POST_TRANSACTION(metadata, JSON.stringify(dataItem))
          );

          const industry = dataItem["Industry"];
          const transactionId = res?.data?.postTransaction?.id;
          if (transactionId) {
            if (!txnData[industry]) {
              txnData[industry] = []; // Initialize the array if it doesn't exist
            }
            txnData[industry].push(transactionId); // Add the transaction ID to the array
          }
          console.log("Inventory added successfully ", transactionId);
        });

        await Promise.all(promises);
        await saveTransactionsToFirestore(txnData);
        fetchInventory();
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    } else {
      setError("Please select only Excel files");
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="page-header">
          <img
            alt="..."
            className="path"
            src={require("../../assets/img/blob.png")}
          />
          <div className="content-center">
            <Row className="row-grid justify-content-between align-items-center text-left">
              <Col lg="6" md="6">
                <h1 className="text-white">
                  We believe in food <br />
                  <span className="text-white">integrity</span>
                </h1>
                <p className="text-white mb-3">
                The whole is the sum of its parts. Find the most important events and properties on your supply chain of your products, raw materials and by-products.
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
            <Row className="justify-content-between">
              <Col>
                <p className="text-white mb-3">
                  <a href="https://cellar.innovint.us/#/login" target="_blank" rel="noopener noreferrer">
                  Click here 
                  </a>
                   &nbsp;to seamlessly access your inventory in InnoVint.
                </p>
              </Col>
            </Row>
            {
                uploadState == ""?
                <Row className="justify-content-between">
 
                <Col>
                <Button
                    color="info"
                    href = "#upload"
                    onClick={()=>setUploadState("Excel")}
                  >
                    <i className="tim-icons icon-attach-87" /> Upload an Excel sheet
                  </Button>
                </Col>
                <Col>
                <Button
                    color="info"
                    onClick={(e)=> {setUploadState("Form")}}
                  >
                    <i className="tim-icons icon-bullet-list-67" /> Fill in manually
                  </Button>
                </Col>
              </Row>: <></>
            }

            <Row style={{marginTop: '2rem'}}>
              <Container>
                <Row className="justify-content-between">
                  <Col>
                  {
                    uploadState == "Excel"?
                    <Card>
                    <CardBody>
                      <Input
                        type="file"
                        placeholder="Upload here!"
                        onChange={readExcel}
                        disabled={currentUser==null}
                      />
                    {error && (
                      <h4 className="text-danger text-center">
                        {error}
                        </h4>
                    )}
                    </CardBody>
                  </Card>:
                  uploadState=="Form"?
                  <Form>
                    {
                      forms.map((form, index) => (
                        <Row key={index} className="mb-3 justify-content-between">
                        <Col>
                          <Input
                            placeholder="Output Product"
                            type="text"
                            id={`outputProducts${index}`}
                            value={form.outputProducts}
                            onChange={(e) => handleInputChange(index, 'outputProducts', e.target.value)}
                          />
                        </Col>
              
                        <Col>
                          <Input
                            placeholder="ByProducts"
                            type="text"
                            id={`byProducts${index}`}
                            value={form.byProducts}
                            onChange={(e) => handleInputChange(index, 'byProducts', e.target.value)}
                          />
                        </Col>
              
                        <Col>
                          <Input
                            placeholder="Timestamp"
                            type="datetime"
                            id={`timestamp${index}`}
                            value={form.timestamp}
                            onChange={(e) => handleInputChange(index, 'timestamp', e.target.value)}
                          />
                        </Col>

                        <Col>
                          <Input
                            placeholder="Input product"
                            type="text"
                            id={`inputProduct${index}`}
                            value={form.inputProduct}
                            onChange={(e) => handleInputChange(index, 'inputProduct', e.target.value)}
                          />
                        </Col>

                        <Col>
                          <Input
                            placeholder="Prod Quantity"
                            type="text"
                            id={`productQuantity${index}`}
                            value={form.productQuantity}
                            onChange={(e) => handleInputChange(index, 'productQuantity', e.target.value)}
                          />
                        </Col>

                        <Col>
                          <Input
                            type="text"
                            placeholder="Byprod Quantity"
                            id={`byproductQuantity${index}`}
                            value={form.byproductQuantity}
                            onChange={(e) => handleInputChange(index, 'byproductQuantity', e.target.value)}
                          />
                        </Col>

                        <Col>
                          <Input
                            placeholder="industry"
                            type="text"
                            id={`industry${index}`}
                            value={form.industry}
                            onChange={(e) => handleInputChange(index, 'industry', e.target.value)}
                          />
                        </Col>              

                      </Row>
                      ))
                    }
                      <Button
                        className="btn-simple"
                        color="info" onClick={handleAddForm}>Add</Button>
                    <Button
                        color="info" onClick={handleSaveData}>Save Data</Button>
                  </Form>:<></>
                  }

                    <div className="btn-wrapper">
                      {
                        currentUser==null?
                        <Button
                        className="btn-simple"
                        color="info"
                        onClick={()=>navigate("/login")}
                      >
                        <i className="tim-icons icon-badge" /> Please log in to view/upload your inventory
                      </Button>:
                        <Button
                        className="btn-simple"
                        color="info"
                        onClick={handleSubmit}
                      >
                        <i className="tim-icons icon-notes" /> Display My Inventory
                      </Button>

                      }
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </div>
        </div>
        <div className="section" id="inventory-section">
          <Container style={{ marginTop: "2rem" }}>
            {inventory.length > 0 ? (
              <InventoryTable inventory={inventory} />
            ) : (
              <div className="w-100 text-center mt-2 text-white">No inventory found!</div>
            )}
          </Container>
        </div>
      </div>
    </>
  );
}
export default DataUploader;
