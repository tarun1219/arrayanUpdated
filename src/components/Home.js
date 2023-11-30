import React, { useEffect, useState } from "react";
import { FETCH_PRODUCT } from "../utils/ResDbApis";
import { sendRequest } from "../utils/ResDbClient";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import Footer from "../components/Footer/Footer";

export default function Home() {
  const [count, setCount] = useState(0);
  const [byProductCount, setByProductCount] = useState(0);

  useEffect(() => {
    getCount();
  });

  const getCount = async () => {
    const query = FETCH_PRODUCT("final-product");
    try {
      sendRequest(query).then((res) => {
        if (res && res.data && res.data.getFilteredProductTransactions) {
          setCount(res.data.getFilteredProductTransactions.length);
          let biprods = [];
          let biCount = 0;
          res.data.getFilteredProductTransactions.forEach((item) => {
            let info = JSON.parse(item.asset.replace(/'/g, '"')).data;
            if (!biprods.includes(info["ByProducts"])) {
              biprods.push(info["ByProducts"]);
              biCount++;
            }
          });
          setByProductCount(biCount);
        } else {
          getCount(); // BUG: Temporary fix for the intermittent graphql error
        }
      });
    } catch (error) {
      console.log("Error retrieving", error);
    }
  };
  return (
    <>
      <div className="wrapper">
        <div className="page-header header-filter">
          <div className="squares square1">
            <img
              alt="..."
              className="img-fluid"
              src={require("../assets/img/orange.png")}
            />
          </div>
          <div className="squares square2">
            <img
              width="70%"
              style={{ float: "right" }}
              alt="..."
              className="img-fluid"
              src={require("../assets/img/burger.png")}
            />
          </div>
          <div className="squares square3">
            <img
              alt="..."
              className="img-fluid"
              src={require("../assets/img/butter.png")}
            />
          </div>
          <div className="squares square4">
            <img
              alt="..."
              className="img-fluid"
              src={require("../assets/img/wine.png")}
            />
          </div>
          <div className="squares square5">
            <img
              alt="..."
              className="img-fluid"
              src={require("../assets/img/cheese.png")}
            />
          </div>
          <div className="squares square6">
            {/* <img
                  alt="..."
                  className="img-fluid"
                  src={require("../assets/img/coffee.png")}
                /> */}
          </div>
          <div className="squares square7">
            <img
              alt="..."
              className="img-fluid"
              src={require("../assets/img/chocobar.png")}
            />
          </div>
          <Container>
            <div className="content-center brand">
              <h1 className="h1-seo">Arrayán</h1>
              <h3 className="d-none d-sm-block">
                A Blockchain-Based Food Supply Chain Application built on
                Resilient DB
              </h3>
            </div>
          </Container>
        </div>
        <section className="section section-lg section-safe">
          <img
            alt="..."
            className="path"
            src={require("../assets/img/path5.png")}
          />
          <Container>
            <Row className="row-grid justify-content-between">
              <Col md="5">
                <img
                  style={{ borderRadius: "5rem" }}
                  alt="..."
                  className="img-fluid floating"
                  src={require("../assets/img/blockchain_FSC.jpg")}
                />
              </Col>
              <Col md="6">
                <div className="px-md-5">
                  <hr className="line-success" />
                  <h3>What is Arrayán?</h3>
                  <p>
                    Arrayán is an innovative solution that digitizes the food
                    supply chain through a blockchain app, fostering industrial
                    symbiosis between the processing food industry, green
                    hydrogen producers, and cosmetic companies.
                  </p>
                  <p style={{ marginTop: "3rem" }}>
                    Arrayán is built on{" "}
                    <a href="https://resilientdb.com">Resilient DB</a>, a robust
                    blockchain fabric, ensuring a secure and efficient platform
                    for transforming the food supply chain and promoting
                    sustainable industrial collaboration.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="section section-lg">
          <Container>
            <Row className="justify-content-center">
              <Col lg="12">
                <h1 className="text-center" style={{ marginBottom: "-5%" }}>
                  Why Arrayán?
                </h1>
                <Row className="row-grid justify-content-center">
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-primary">
                        <i className="tim-icons icon-chart-pie-36" />
                      </div>
                      <h4 className="info-title">Reduce food wastage</h4>
                    </div>
                  </Col>
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-warning">
                        <i className="tim-icons icon-link-72" />
                      </div>
                      <h4 className="info-title">Preserve food safety</h4>
                    </div>
                  </Col>
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-success">
                        <i className="tim-icons icon-spaceship" />
                      </div>
                      <h4 className="info-title">
                        Boost the valorization of by-products
                      </h4>
                    </div>
                  </Col>
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-danger">
                        <i className="tim-icons icon-lock-circle" />
                      </div>
                      <h4 className="info-title">Enhance Food security</h4>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="section section-lg">
          <Container>
            <Row className="justify-content-center text-center">
              <h3>Stats</h3>

              <Col className="mt-lg-5" md="5">
                <Card className="card-stats bg-default">
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="tim-icons icon-gift-2 text-info" />
                        </div>
                      </Col>
                      <Col md="8" xs="7">
                        <div className="numbers">
                          <CardTitle tag="p">1</CardTitle>
                          <p />
                          <p className="card-category">
                            Participating Organization
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col className="mt-lg-5" md="5">
                <Card className="card-stats bg-default">
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="tim-icons icon-gift-2 text-info" />
                        </div>
                      </Col>
                      <Col md="8" xs="7">
                        <div className="numbers">
                          <CardTitle tag="p">1</CardTitle>
                          <p />
                          <p className="card-category">Product</p>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col className="mt-lg-5" md="5">
                <Card className="card-stats bg-default">
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="tim-icons icon-gift-2 text-info" />
                        </div>
                      </Col>
                      <Col md="8" xs="7">
                        <div className="numbers">
                          <CardTitle tag="p">{byProductCount}</CardTitle>
                          <p />
                          <p className="card-category">ByProducts</p>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col className="mt-lg-5" md="5">
                <Card className="card-stats bg-default">
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="tim-icons icon-credit-card text-success" />
                        </div>
                      </Col>
                      <Col md="8" xs="7">
                        <div className="numbers">
                          <CardTitle tag="p">{count}</CardTitle>
                          <p />
                          <p className="card-category">Transactions</p>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
        <Footer />
      </div>
    </>
  );
}
