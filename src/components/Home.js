import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Footer from "../components/Footer/Footer";
import Dashboard from "./Dashboard";
import CoverPicture from "../components/CoverPicture";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();


  return (
    <>
      <div className="wrapper">
        {/* <div className="page-header header-filter">
          <Container>
            
            <div className="content-center brand">
              <h1 className="h1-seo">Arrayán</h1>
              <h3 className="d-none d-sm-block">
                A Blockchain-Based Food Supply Chain Application built on
                ResilientDB
              </h3>
            </div>
          </Container>
        </div> */}
        <section className="section section-lg section-safe">
          {/* <img
            alt="..."
            className="path"
            src={require("../assets/img/path5.png")}
          /> */}
                    <Container>
            <Row className="row-grid justify-content-between">
              <Col md="5">
              <div className="content-center brand" style={{marginTop: '5rem'}}>
              <h2 className="title">A Blockchain-Based Food Supply Chain Application built on
                ResilientDB</h2>
            <h4 className="description">
            Revolutionizing traceability with blockchain integration, empowering industries 
                through transparent supply chain tracking, and pioneering sustainable innovation by reclaiming 
                and transforming by-products for a brighter, eco-conscious future.
            </h4>
            <Button
                        color="info"
                        onClick={()=>navigate("/track")}
                      >Explore the Sample</Button>
              <Button
                        color="success"
                        onClick={()=>navigate("/register")}
                      >Register with us</Button>
            </div>
              </Col>
              <Col md="6">
                <CoverPicture />
              </Col>
            </Row>
          </Container>
          <Container>
            <Row className="row-grid justify-content-between">
              <Col md="5">
                <img
                  style={{ borderRadius: "5rem" }}
                  alt="..."
                  className="floating"
                  src={require("../assets/img/arrayan.jpg")}
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
                    <a href="https://resilientdb.com">ResilientDB</a>, a robust
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
                      <div className="icon icon-warning">
                        <i className="tim-icons icon-link-72" />
                      </div>
                      <h4 className="info-title">Preserve food safety</h4>
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
                      <div className="icon icon-success">
                        <i className="tim-icons icon-spaceship" />
                      </div>
                      <h4 className="info-title">
                        Boost the valorization of by-products
                      </h4>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <Dashboard />
        <Footer />
      </div>
    </>
  );
}
