import React from "react";
import IndexNavbar from "../components/Navbars/IndexNavbar";
import Home from "../components/Home";
import CoverPicture from "../components/CoverPicture";
import BackgroundParticles from "../components/BackgroundParticles";

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
        {/* <CoverPicture /> */}
        <BackgroundParticles />
        <Home />
        <div className="main"></div>
      </div>
    </>
  );
};
export default LandingPage;
