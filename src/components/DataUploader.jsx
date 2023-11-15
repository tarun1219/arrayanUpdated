import React, { useState } from "react";
import * as xlsx from "xlsx";
import { Form, Card } from "react-bootstrap";
import { POST_TRANSACTION } from "../utils/ResDbApis";
import { sendRequest } from "../utils/ResDbClient";

function DataUploader() {
  const ALLOWED_FILE_TYPES = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  //TODO: Remove encryption keys from code
  const metadata = {
    signerPublicKey: "2Efjkz7BRTY9UxNmNwLCTpUKNywvSw57jGxSF3W8UXcf",
    signerPrivateKey: "SeWpVh89MHJ94uPpfrTHNDxLj6EQ6qhPifbRfpdsjun",
    recipientPublicKey: "55W2yfo2V9yrMPNy4B41E6CyWd1Z6jddFHEeuofYxj4J",
  };

  const [excelData, setExcelData] = useState(null);
  const [error, setError] = useState("");

  const readExcel = (e) => {
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
        setExcelData(json);
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

        {excelData ? (
          <div>
            <div className="w-100 text-center mt-2">
              Inventory added successfully
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(excelData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {excelData.map((individualExcelData, index) => (
                    <tr key={index}>
                      {Object.keys(individualExcelData).map((key) => (
                        <td key={key}>{individualExcelData[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="w-100 text-center mt-2">No File is uploaded yet!</div>
        )}
      </Card.Body>
    </Card>
  );
}
export default DataUploader;
