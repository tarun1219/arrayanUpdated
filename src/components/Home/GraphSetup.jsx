const GraphSetup = {
    data: (data) => {
      let ctx = document.getElementById("total-txns")?.getContext("2d");
  
      let gradientFill = ctx?.createLinearGradient(0, 230, 0, 50);
  
      gradientFill?.addColorStop(1, "rgba(29,140,248,0.2)");
      gradientFill?.addColorStop(0.4, "rgba(29,140,248,0.0)");
      gradientFill?.addColorStop(0, "rgba(29,140,248,0)"); 
  
      return {
        labels: Object.keys(data),
        datasets: [
          {
            label: "Transaction Count",
            fill: true,
            backgroundColor: gradientFill,
            borderColor: "#1d8cf8",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#1d8cf8",
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#5464ed",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: Object.values(data),
          },
        ],
      };
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
  
      tooltips: {
        backgroundColor: "#fff",
        titleFontColor: "#ccc",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      responsive: true,
      scales: {
      },
    },
  };
  
  export default GraphSetup;
  