import React, { useEffect } from "react";
import DataUploader from "../components/Inventory/DataUploader";
import IndexNavbar from "../components/Navbars/IndexNavbar";

const InventoryPage = () => {
  useEffect(() => {
    if (!window.location.search.includes("refreshed=true")) {
      const separator = window.location.href.includes('?') ? '&' : '?';
      window.location.href =
        window.location.href + separator + "refreshed=true";
    }
  }, []);

  return (
    <>
      <IndexNavbar />
      <DataUploader />
    </>
  );
};

export default InventoryPage;
