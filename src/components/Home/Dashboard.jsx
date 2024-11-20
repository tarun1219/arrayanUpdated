import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
} from "reactstrap";
import { fetchMetadata } from "../../context/FirestoreContext";
import { Line } from "react-chartjs-2";
import GraphSetup from "./GraphSetup";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function Dashboard() {

  const [TransactionCount, setTransactionCount] = useState({
    "Jan": 0,
    "Feb": 0,
    "Mar": 0,
    "Apr": 0,
    "May": 0,
    "Jun": 0,
    "Jul": 0,
    "Aug": 0,
    "Sept": 0,
    "Oct": 0,
    "Nov": 0,
    "Dec": 0
  });

  const [totalStats, setTotalStats] = useState({
    "products": 0,
    "txns": 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("Fetching data...");
    try {
      const { totalCount, totalTxns } = await fetchMetadata(TransactionCount, totalStats);

      setTransactionCount(totalTxns);
      setTotalStats(totalCount); 
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }

  };

  return (
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
                      <i className="tim-icons icon-bank text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <CardTitle tag="p">{totalStats?.txns}</CardTitle>
                      <p />
                      <p className="card-category">
                        Transactions
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
                      <i className="tim-icons icon-delivery-fast text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <CardTitle tag="p">{totalStats?.products}</CardTitle>
                      <p />
                      <p className="card-category">Products</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md="12">
            <Card className="card-chart card-plain">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <hr className="line-info" />
                    <CardTitle tag="h2">Total transactions</CardTitle>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    id="total-txns"
                    data={GraphSetup.data(TransactionCount.totalTxns? TransactionCount.totalTxns: TransactionCount)}
                    options={GraphSetup.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
export default Dashboard;
