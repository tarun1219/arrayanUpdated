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
import { GET_TRANSACTION, POST_UPDATED_TRANSACTION, constructTransaction } from "./../../utils/ResDbApis";
import { sendRequest } from "./../../utils/ResDbClient";
import { firestoreDB } from "./../../auth/firebaseAuthSDK";
import Timeline from "./Timeline";
import { AuthContext } from "./../../context/AuthContext";
import { deleteClaimedTransactionIds, saveTransactionsToFirestore, fetchSmartContractsFromFirestore} from "../../context/FirestoreContext";
import { useNavigate } from "react-router-dom";

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
  const [manualSelectedKeys, setManualSelectedKeys] = useState({});
  const [autoSelectedKeys, setAutoSelectedKeys] = useState({});
  const [confirmedItems, setConfirmedItems] = useState({});
  const {currentUser, userKeys} = useContext(AuthContext);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleModal = () => setModal(!modal);
  const navigate = useNavigate();

  const metadata = {
    signerPublicKey: userKeys?.publicKey,
    signerPrivateKey: userKeys?.privateKey,
    recipientPublicKey: process.env.REACT_APP_RECIPIENT_PUBLIC_KEY,
  }; 

  const updateFireStore = async (claimedItems, finalSelected) => {
    let claimedTxnIds = [];
    let industryMap = {};
    let monthlyTransactionCounts = {}; 
    try {
      const promises = Object.values(finalSelected).map(async (item) => {
        const txn = constructTransaction(metadata, item)
        const query = POST_UPDATED_TRANSACTION(txn);
        const res = await sendRequest(POST_UPDATED_TRANSACTION(txn));
        const industry = product;
        const transactionId = res?.data?.postTransaction?.id;
        if (transactionId) {
          if (!industryMap[industry]) {
            industryMap[industry] = [];
          }
          industryMap[industry].push(transactionId);
          const currentDate = new Date();
          const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
      
          if (!monthlyTransactionCounts[yearMonth]) {
            monthlyTransactionCounts[yearMonth] = {
              txnCount: 0,
              products: new Set(),
            }
          }
          monthlyTransactionCounts[yearMonth].txnCount += 1;
          monthlyTransactionCounts[yearMonth].products.add(industry);
        }
        claimedTxnIds.push(item.key)
      })

      await Promise.all(promises);
      await saveTransactionsToFirestore(metadata.signerPublicKey, industryMap, monthlyTransactionCounts);
      await deleteClaimedTransactionIds(product, claimedTxnIds);

      setConfirmedItems((prevState) => ({
        ...prevState,
        ...Object.fromEntries(claimedItems.map((key) => [key, true])),
      }));
      if (Object.keys(manualSelectedKeys).length !== 0) {
        alert(`Claim Successful!`);
      }
    } catch (error) {

    }
  }
  const handleClaimClick = async (byproductName, items) => {
    setSelectedProduct(byproductName);
    setOptions(items);
    setManualSelectedKeys({});
    const fetchedContracts = await fetchSmartContractsFromFirestore(metadata.signerPublicKey);
    let autoSelected = {};
    for (const item of items) {
      const itemKey = String(item.key);
      const sourceName = `${item.info.Name} - ${item.info.Description}`.trim();
      const matchingContracts = fetchedContracts.filter((contract) =>
        contract.product === product &&
        contract.byproduct === byproductName &&
        contract.source.trim() === sourceName
      );
      const itemTimestamp = new Date(item.info.Timestamp);
      const isValid = matchingContracts.some((contract) => {
        const contractEndDate = new Date(contract.endDate);
        return itemTimestamp < contractEndDate;
      });
  
      if (isValid) {
        autoSelected[itemKey] = item;
        break;
      }
    }
    setAutoSelectedKeys(autoSelected);
    if (Object.keys(autoSelected).length > 0) {
      handleConfirmClaim(autoSelected);
    }
    setTimeout(() => {
      toggleModal();
    }, 100);
  };
  
  

  const getFinalSelectedKeys = () => {
    return { ...autoSelectedKeys, ...manualSelectedKeys };
  };

  const handleCheckboxChange = (item) => {
    setManualSelectedKeys((prevState) => {
      const updatedState = { ...prevState };
      if (updatedState[item.key]) {
        delete updatedState[item.key];
      } else {
        updatedState[item.key] = item;
      }
      return updatedState;
    });
  };

  const handleConfirmClaim = async (localAutoSelected = null) => {
    const finalSelected = localAutoSelected || { ...autoSelectedKeys, ...manualSelectedKeys };
    const claimedItems  = Object.keys(finalSelected);
  
    if (claimedItems.length === 0) {
      alert('Please select at least one item to claim.');
      toggleModal();
      return;
    }
  
    await updateFireStore(claimedItems, finalSelected);
    toggleModal();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimeout(() => {
      document
      .getElementById("track-section")
      ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setIsSubmitted(true);
    trackProduct();
  };

  const fetchTransactionIds = async () => {
    const productRef = firestoreDB.collection('products').doc(product);
    try {
      const doc = await productRef.get();

      if (doc.exists) {
        const productData = doc.data();
        setTxnIds(productData.txnIds || []);
      } else {
        setProductFound(false);
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
          let info = res.data.getTransaction.asset.data;
          let recipientPublicKey = res?.data?.getTransaction.signerPublicKey;
          let op = info["OutputProducts"];
          let ip = info["InputProduct"];

          if (!adj[ip]) adj[ip] = [];

          if (op == ip) initProd = info;
          else {
            adj[ip].push(info);
          }
          
          if(info["ByProducts"] != "None" && info["ByProducts"] != ""){
            if(!byprods[info["ByProducts"]]) byprods[info["ByProducts"]] = [];
            byprods[info["ByProducts"]].push({key: id, info:info, recipientPublicKey:recipientPublicKey});
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
            <Container>
              <UncontrolledAlert className="alert-with-icon" color="success">
                <span data-notify="icon" className="tim-icons icon-bulb-63" />
                <span>
                  <b>Voila! </b>
                  Here’s the path builded with purpose, the path shaped with traceability for sustainability.
                </span>
              </UncontrolledAlert>
              <div>
          </div>
          <div className="timeline-header">
              <h5 style={{color: "#39d884"}}>Food Supply Chain of {product}</h5>
              <p className="timeline-subtitle">Tap <span style={{color: "#39d884"}}>+</span> on timeline to view more details</p>
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
        {options.map((item) => (
          <div key={item.key}>
            {item.info.Name} - {item.info.Description}
            <div className="float-right">
              <Input
                type="checkbox"
                checked={!!getFinalSelectedKeys()[item.key]}
                onChange={() => handleCheckboxChange(item)}
                disabled={!!confirmedItems[item.key]}
              />
              {autoSelectedKeys[item.key] && (
                <span style={{ color: "green", fontSize: "0.9em", marginLeft: "0.5rem" }}>
                  Acquired by contract
                </span>
              )}
            </div>
          </div>
        ))}
      </ModalBody>
        <ModalFooter>
        {currentUser==null?
          <Button
          className="btn-simple"
          color="info"
          onClick={()=>navigate("/login")}
        >
          <i className="tim-icons icon-badge" /> Please log in to claim
        </Button>:
          <Button color="success" onClick={() => handleConfirmClaim()}>
            Claim
          </Button>}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
        </div>
            </Container>
        </div> ) :
          <div className={isSubmitted? "section": ""} id="track-section">
           { productFound ? isSubmitted? 
              <div className="loading-indicator">
                  <div className="loading-spinner"></div>
                  <p>Building Your Product's Journey...</p>
              </div>
              : null
            :<h2 className="section text-danger text-center">Product not found!</h2>
           }
          </div>
        }
      </div>
    </>
  );
}
export default ProductTracker;

