import React from "react";
import IndexNavbar from "../components/Navbars/IndexNavbar";
import Home from "../components/Home/Home";
import BackgroundParticles from "../components/Home/BackgroundParticles";

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
        <BackgroundParticles />
        <Home />
        <div className="main"></div>
      </div>
    </>
  );
};
export default LandingPage;
