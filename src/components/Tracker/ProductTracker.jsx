import React, { useState, useEffect, useContext } from "react";
import {
  Input,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Container,
  UncontrolledAlert,Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";

import { GET_TRANSACTION, UPDATE_MULTIPLE_TXNS, constructTransaction } from "./../../utils/ResDbApis";
import { sendRequest } from "./../../utils/ResDbClient";
import { firestoreDB } from "./../../auth/firebaseAuthSDK";
import Timeline from "./Timeline";
import { AuthContext } from "./../../context/AuthContext";

function ProductTracker() {
  const [productStages, setProductStages] = useState(null);
  const [product, setProduct] = useState("");
  const [initialProduct, setInitialProduct] = useState({});
  const [productFound, setProductFound] = useState(true);
  const [byproducts, setByproducts] = useState({});
  const [txnIds, setTxnIds] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState({});
  const [confirmedItems, setConfirmedItems] = useState({});
  const {currentUser, userKeys} = useContext(AuthContext);

  const toggleModal = () => setModal(!modal);

  const metadata = {
    signerPublicKey: userKeys?.publicKey,
    signerPrivateKey: userKeys?.privateKey,
  };

  const updateFireStore = async (claimedItems) => {
    const txnData = Object.values(selectedKeys).map((item) =>
      constructTransaction(metadata, item)
    );

    try {
      const res = await sendRequest(UPDATE_MULTIPLE_TXNS(txnData));

      if(res && res.data){
        const productRef = firestoreDB.collection('products').doc(product);
        const originalKeys = Object.values(selectedKeys).map((item) => item.key);
        const newIds = res.data.updateMultipleTransaction.map((transaction) => transaction.id);

        let updatedTxns = txnIds.filter((id) => !originalKeys.includes(id));
        updatedTxns = [...updatedTxns, ...newIds]

        await productRef.update({
          transactionIds: updatedTxns,
        });

        setConfirmedItems((prevState) => ({
          ...prevState,
          ...Object.fromEntries(claimedItems.map((key) => [key, true])),
        }));

        console.log('Claimed Objects:', claimedItems);
        alert(`Claim Successful!`);
      }
    } catch (error) {

    }
  }

  const handleClaimClick = (productName, items) => {
    setSelectedProduct(productName);
    setOptions(items);
    setSelectedKeys({});
    toggleModal();
  };

  const handleCheckboxChange = (item) => {
    setSelectedKeys((prevState) => {
      const updatedState = { ...prevState };
      if (updatedState[item.key]) {
        delete updatedState[item.key];
      } else {
        updatedState[item.key] = item;
      }
      return updatedState;
    });
  };

  const handleConfirmClaim = async () => {
    const claimedItems = Object.values(selectedKeys).map(item => item.key);

    if (claimedItems.length === 0) {
      alert('Please select at least one item to claim.');
      toggleModal();
      return;
    }

    await updateFireStore(claimedItems);
    toggleModal();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    document
      .getElementById("track-section")
      ?.scrollIntoView({ behavior: "smooth" });
    trackProduct();
  };

  const fetchTransactionIds = async () => {
    const productRef = firestoreDB.collection('products').doc(product);
    try {
      const doc = await productRef.get();

      if (doc.exists) {
        const productData = doc.data();
        setTxnIds(productData.transactionIds || []);
      } else {
        console.log(`No transactions found for product: ${product}`);
      }
    } catch (error) {
      setProductFound(false);
      console.error('Error fetching transactions from Firestore:', error);
    }
  };

  useEffect(() => {
    const fetchTxnData = async () => {
    if(txnIds.length > 0)
    try {
      let adj = {};
      let initProd = {};
      let byprods = {};

      for(const id of txnIds){
        const res = await sendRequest(GET_TRANSACTION(id));
        if(res && res.data) {
          let info = JSON.parse(res.data.getTransaction.asset.replace(/'/g, '"')).data;
          let op = info["OutputProducts"];
          let ip = info["InputProduct"];

          if (!adj[ip]) adj[ip] = [];

          if (op == ip) initProd = info;
          else {
            adj[ip].push(info);
          }
          
          if(info["ByProducts"] != "None" && info["ByProducts"] != ""){
            if(!byprods[info["ByProducts"]]) byprods[info["ByProducts"]] = [];
            byprods[info["ByProducts"]].push({key: id, info:info});
          }
        }
        await new Promise(resolve => setTimeout(resolve, 5));
      }
        setInitialProduct(initProd)
        setProductStages(adj);
        console.log(adj)
        setByproducts(byprods);
      } catch (error) {
        setProductFound(false);
        console.log("Product tracking error ", error);
      }
    }

    fetchTxnData();
  }, [txnIds]);

  const trackProduct = async () => {
    console.log("Tracking product: ", product);
    setProductStages({});
    setProductFound(true);
    setTxnIds([]);
    if (product == "") {
      setProductFound(false);
      return;
    }

    await fetchTransactionIds();
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
                  We keep your food <br />
                  <span className="text-white">secured</span>
                </h1>
                <p className="text-white mb-3">
                  Each one of your products is unique. Access to the footprint of your product from farm to fork and beyond.
                </p>
              </Col>
              <Col lg="4" md="5">
                <img
                  alt="..."
                  className="img-fluid"
                  src={require("../../assets/img/donut.png")}
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
                          type="text"
                          placeholder="Track your product's tale."
                          onChange={(e) => setProduct(e.target.value)}
                          required
                        />
                        <p className="text-white mb-3" style={{marginTop: '1rem'}}>Try the sample with 'Pinot Noir bottle of wine'</p>
                      </CardBody>
                    </Card>
                    <div className="btn-wrapper">
                      <Button
                        className="btn-simple"
                        color="info"
                        href="#pablo"
                        onClick={handleSubmit}
                      >
                        <i className="tim-icons icon-bulb-63" /> Track
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Row className="justify-content-between">
                  <Col style={{marginTop: '1rem'}}>
                  <p className="text-white mb-3 font-italic">
                    Do you want to discover Carbon Footprint of your plate?&nbsp;
                  <a href="https://amoolya-reddy.github.io/respirer/" target="_blank" rel="noopener noreferrer">
                  Try Respirer 
                  </a>
                </p>
                  </Col>
                </Row>
              </Container>
            </Row>
          </div>
        </div>
        {productStages && Object.keys(productStages).length > 0 ? (
        <div className="section" id="track-section">
          {/* <img
            alt="..."
            className="path"
            width="100%"
            src={require("../../assets/img/waves.png")}
          /> */}
            <Container style={{ marginTop: "2rem" }}>
              <UncontrolledAlert className="alert-with-icon" color="success">
                <span data-notify="icon" className="tim-icons icon-bulb-63" />
                <span>
                  <b>Voila! </b>
                  Here’s the path builded with purpose, the path shaped with traceability for sustainability.
                </span>
              </UncontrolledAlert>
              <div>
          </div>
            <Timeline productStages={productStages} initialKey = {initialProduct["InputProduct"]}/>
            
            <div className="byproducts-container">
      <h4 className="byproducts-title">BY-PRODUCTS</h4>
      <ul className="byproducts-list">
        {Object.entries(byproducts).map(([byproductName, items]) => (
          <li key={byproductName} className="byproduct-item">
            <h5 className="byproduct-name">{byproductName}</h5>
            <Button
              color="primary"
              onClick={() => handleClaimClick(byproductName, items)}
            >
              Claim
            </Button>
          </li>
        ))}
      </ul>

      {/* Modal for Claim Options */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader>
      <div className="text-white byproducts">
          Select the sources to claim {selectedProduct}
        </div>
        <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-hidden="true"
        onClick={toggleModal}
      >
        <i className="tim-icons icon-simple-remove" />
      </button>
      </ModalHeader>
        <ModalBody>
            {options.map((item, idx) => (
              <div key={item.key}>
                {item.info.Name} - {item.info.Description}
                <div className="float-right">
                <Input
                  type="checkbox"
                  checked={selectedKeys[item.key] || false}
                  onChange={() => handleCheckboxChange(item)}
                  disabled={confirmedItems && confirmedItems[item.key]}
                />
                </div>
              </div>
            ))}
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleConfirmClaim}>
            Claim
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
            </Container>
        </div> ) : productFound ? (
          <div />
        ) : (
          <h2 className="text-danger text-center">Product not found!</h2>
        )}
      </div>
    </>
  );
}

export default ProductTracker;
