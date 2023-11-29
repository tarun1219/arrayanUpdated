import React, { useEffect, useState } from "react";
import * as xlsx from "xlsx";
import {
  Input,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Container,
} from "reactstrap";
import { POST_TRANSACTION, FETCH_TRANSACTION } from "../utils/ResDbApis";
import { sendRequest } from "../utils/ResDbClient";

function DataUploader() {
  const ALLOWED_FILE_TYPES = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  //TODO: Remove encryption keys from code
  const metadata = {
    signerPublicKey: "HvNRQznqrRdCwSKn6R8ZoQE4U3aobQShajK1NShQhGRn",
    signerPrivateKey: "2QdMTdaNj8mJjduXFAsHieVmcsBcqeWQyW9v891kZEXC",
    recipientPublicKey: "HvNRQznqrRdCwSKn6R8ZoQE4U3aobQShajK1NShQhGRn",
  };

  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    console.log("Fetching inventory...");
    const query = FETCH_TRANSACTION(
      metadata.signerPublicKey,
      metadata.signerPublicKey
    );
    try {
      sendRequest(query).then((res) => {
        if (res && res.data && res.data.getFilteredTransactions) {
          let json = [];
          res.data.getFilteredTransactions.forEach((item) => {
            json.push(JSON.parse(item.asset.replace(/'/g, '"')).data);
          });
          setInventory(json);
          console.log(json);
        } else {
          fetchInventory(); // BUG: Temporary fix for the intermittent graphql error
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

  const readExcel = async (e) => {
    e.preventDefault();
    let selectedFile = e.target.files[0];
    if (selectedFile && ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      document
      .getElementById("inventory-section")
      .scrollIntoView({ behavior: "smooth" });
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "json" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        json.forEach((dataItem) => {
          sendRequest(
            POST_TRANSACTION(metadata, JSON.stringify(dataItem))
          ).then((res) => {
            console.log("Inventory added successfully ", res);
          });
        });
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
            src={require("../assets/img/blob.png")}
          />
          <div className="content-center">
            <Row className="row-grid justify-content-between align-items-center text-left">
              <Col lg="6" md="6">
                <h1 className="text-white">
                  We believe in food <br />
                  <span className="text-white">integrity</span>
                </h1>
                <p className="text-white mb-3">
                  TODO: CHANGE THE MATTER A wonderful serenity has taken
                  possession of my entire soul, like these sweet mornings of
                  spring which I enjoy with my whole heart.
                </p>
              </Col>
              <Col lg="4" md="5">
                <img
                  alt="..."
                  className="img-fluid"
                  src={require("../assets/img/inventory.png")}
                />
              </Col>
            </Row>
            <Row>
              <Container>
                <Row className="justify-content-between">
                  <Col>
                    <Card>
                      <CardBody>
                        <Input
                          type="file"
                          placeholder="Upload here!"
                          onChange={readExcel}
                        />
                      {error && (
                        <h4 className="text-danger text-center">
                          {error}
                          </h4>
                      )}
                      </CardBody>
                    </Card>
                    <div className="btn-wrapper">
                      <Button
                        className="btn-simple"
                        color="info"
                        href="#pablo"
                        onClick={handleSubmit}
                      >
                        <i className="tim-icons icon-notes" /> Display My Inventory
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </div>
        </div>
        <div className="section" id="inventory-section" style={{marginLeft: '-10rem'}}>
          <img
            alt="..."
            className="path"
            width="100%"
            src={require("../assets/img/waves.png")}
          />
          <Container style={{ marginTop: "2rem" }}>
            {inventory.length > 0 ? (
              <table className="tablesorter" >
                <thead className="text-white">
                  <tr>
                    {Object.keys(inventory[0]).map((key) => (
                      <th className="header text-center" style={{padding: '1rem'}}>{key}</th>
                    ))}
                  </tr>
                  
                </thead>
                <tbody>
                  {inventory.map((item, index) => (
                    <tr>
                      {Object.keys(item).map((key) => (
                        <td className="text-center" style={{padding: '1rem', color: "white"}}>{item[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
