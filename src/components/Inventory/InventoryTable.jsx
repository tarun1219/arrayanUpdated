import React, { useState } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Button } from "reactstrap";

function InventoryTable({ inventory }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const entriesPerPage = 7;

  const filteredInventory = isFilterActive
    ? inventory.filter((item) => item.hasOwnProperty("ClaimedByproducts") && item["ClaimedByproducts"]!="")
    : inventory;

  const displayKeys = [
    "Name",
    "EventType",
    "ByProducts",
    "OutputProducts",
    "ClaimedByproducts"
  ];

  const headerNames = {
    Name: "Industry",
    EventType: "Event",
    ByProducts: "By Products",
    OutputProducts: "Output Products",
    ClaimedByproducts: "Claimed By-Products"
  };

  const totalPages = Math.ceil(filteredInventory.length / entriesPerPage);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredInventory.slice(indexOfFirstEntry, indexOfLastEntry);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleFilter = () => {
    setIsFilterActive(!isFilterActive);
    setCurrentPage(1);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "right"}}>
        <Button color="info" onClick={toggleFilter}>
          {isFilterActive ? "Show All" : "Show Only Claimed By-products"}
        </Button>
      </div>
      <div className="inventory">
      <div className="inventory-table">
      <Table className="align-items-center table-dark table-flush">
          <thead className="thead-dark">
            <tr>
              {displayKeys.map((key) => (
                <th className="text-center" style={{ padding: "1rem", color: "white" }} key={key}>
                {headerNames[key] || key}
              </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item, index) => (
              <tr key={index}>
                {displayKeys.map((key) => (
                  <td className="text-center" style={{ padding: "1rem", color: "white" }} key={key}>
                    {item[key] !== undefined ? item[key] : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination
        className="pagination justify-content-center"
        listClassName="justify-content-center"
        style={{ marginTop: "1rem" }}
      >
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink onClick={() => handlePageChange(currentPage - 1)} previous />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem active={index + 1 === currentPage} key={index}>
            <PaginationLink onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink onClick={() => handlePageChange(currentPage + 1)} next />
        </PaginationItem>
      </Pagination>
      </div>
    </div>
  );
}

export default InventoryTable;
