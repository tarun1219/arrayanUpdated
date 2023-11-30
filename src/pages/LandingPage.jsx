import React from "react";
import IndexNavbar from "../components/Navbars/IndexNavbar";
import Home from "../components/Home";

const LandingPage = () => {
  React.useEffect(() => {
    document.body.classList.toggle("index-page");
    return function cleanup() {
      document.body.classList.toggle("index-page");
    };
  }, []);

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <Home />
        <div className="main"></div>
      </div>
    </>
  );
};
export default LandingPage;
