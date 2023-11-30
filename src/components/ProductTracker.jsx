import React, { useState } from "react";
import {
  Input,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Container,
  CardFooter,
} from "reactstrap";

import { FETCH_PRODUCT } from "../utils/ResDbApis";
import { sendRequest } from "../utils/ResDbClient";
import { CardHeader } from "react-bootstrap";

function ProductTracker() {
  const [productStages, setProductStages] = useState(null);
  const [product, setProduct] = useState("");
  const [initialProduct, setInitialProduct] = useState({});
  const [productFound, setProductFound] = useState(true);
  const [biproducts, setBiproducts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    document
      .getElementById("track-section")
      .scrollIntoView({ behavior: "smooth" });
    trackProduct();
  };

  const trackProduct = async () => {
    console.log("Tracking product: ", product);
    if(product=="") {
      setProductFound(false);
      return;
    }
    const query = FETCH_PRODUCT(product);
    try {
      sendRequest(query).then((res) => {
        if (res && res.data && res.data.getFilteredProductTransactions) {
          if (res.data.getFilteredProductTransactions.length == 0)
            setProductFound(false);
          else setProductFound(true);

          let adj = {};
          let biprods = [...biproducts];

          res.data.getFilteredProductTransactions.forEach((item) => {
            let info = JSON.parse(item.asset.replace(/'/g, '"')).data;
            console.log("amul ", info)
            let op = info["OutputProducts"];
            let ip = info["InputProduct"];

            if (!adj[ip]) adj[ip] = [];

            if (op == ip) setInitialProduct(info);
            else {
              adj[ip].push(info);
            }

            if (!biprods.includes(info["ByProducts"])) {
              biprods.push(info["ByProducts"]);
            }
          });
          setProductStages(adj);
          setBiproducts(biprods);
        } else {
          trackProduct(); // BUG: Temporary fix for the intermittent graphql error
        }
      });
    } catch (error) {
      setProductFound(false);

      console.log("Product tracking error ", error);
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
                  We keep your food <br />
                  <span className="text-white">secured</span>
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
                  src={require("../assets/img/donut.png")}
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
                          placeholder="Track your product here!"
                          onChange={(e) => setProduct(e.target.value)}
                          required
                        />
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
              </Container>
            </Row>
          </div>
        </div>
        <div className="section" id="track-section">
          <img
            alt="..."
            className="path"
            width="100%"
            src={require("../assets/img/waves.png")}
          />
          {productStages && Object.keys(productStages).length > 0 ? (
            <Container style={{ marginTop: "2rem" }}>
              <Row key={0}>
                <Col>
                  <Card>
                    <CardHeader>
                      <h3>{initialProduct['OutputProducts']}</h3>
                    </CardHeader>
                    <CardBody>
                      <Card className="text-left card-stats bg-default">
                        <CardBody>
                          <ul>
                            <li>Name: {initialProduct.Name}</li>
                            <li> Desc: {initialProduct.Description}</li>
                            <li>Event: {initialProduct.EventType}</li>
                          </ul>
                        </CardBody>
                      </Card>
                    </CardBody>
                  </Card>
                </Col>
                {Object.keys(productStages).map((node, index) => (
                  <Col>
                    <Card>
                      <CardHeader>
                        <h3>{productStages[node][0]['OutputProducts']}</h3>
                      </CardHeader>
                      <CardBody>
                        {productStages[node].map((neighbor) => (
                          <Card
                            className="text-left card-stats bg-default"
                            style={{ marginBottom: "0.5rem" }}
                          >
                            <CardBody>
                              <ul>
                                <li>Name: {neighbor.Name}</li>
                                <li> Desc: {neighbor.Description}</li>
                                <li>Event: {neighbor.EventType}</li>
                              </ul>
                            </CardBody>
                          </Card>
                        ))}
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
              {biproducts.length > 0 ? (
                <Row>
                  <Col>
                    <Card className="card-coin card-plain">
                      <CardBody>
                        <Row>
                          <Col className="text-center" md="12">
                            <h4 className="text-uppercase">By-Products</h4>
                            <hr className="line-primary" />
                          </Col>
                        </Row>
                        <Row>
                          <Col className="text-center" md="12">
                            {biproducts.map((item) => (
                              <p>{item}</p>
                            ))}
                          </Col>
                        </Row>
                      </CardBody>
                      <CardFooter className="text-center">
                        <Button className="btn-simple" color="primary">
                          Claim
                        </Button>
                      </CardFooter>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <></>
              )}
            </Container>
          ) : productFound ? (
            <div />
          ) : (
            <h2 className="text-danger text-center">Product not found!</h2>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductTracker;
