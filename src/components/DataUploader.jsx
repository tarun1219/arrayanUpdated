import React, { useEffect, useState } from "react";
import * as xlsx from "xlsx";
import { Form, Card } from "react-bootstrap";
import { POST_TRANSACTION, FETCH_INVENTORY } from "../utils/ResDbApis";
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
    const query = FETCH_INVENTORY(metadata.signerPublicKey);
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

  const readExcel = async (e) => {
    e.preventDefault();
    let selectedFile = e.target.files[0];
    if (selectedFile && ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
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
    <Card>
      <Card.Body>
        <h2 className="text-center mb-4">Upload File</h2>
        <Form>
          <Form.Control type="file" onChange={readExcel} required />
        </Form>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {inventory.length > 0 ? (
          <div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(inventory[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {inventory.map((item, index) => (
                    <tr key={index}>
                      {Object.keys(item).map((key) => (
                        <td key={key}>{item[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="w-100 text-center mt-2">No inventory found!</div>
        )}
      </Card.Body>
    </Card>
  );
}
export default DataUploader;
