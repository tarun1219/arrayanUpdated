// Reference axios from the global scope.
const axiosInstance = window.axios;

// Function to send a GraphQL request.
const sendRequest = async (query) => {
  const headers = { 'Content-Type': 'application/json' };
  const data = { query };

  console.log('Sending request with data:', data);
  try {
    const response = await axiosInstance.post('https://cloud.resilientdb.com/graphql', data, { headers });
    console.log('Response received:', response.data);
    return response.data;
  } catch (err) {
    console.error('Request error:', err);
    throw err;
  }
};

// Updated GraphQL query without subfields on asset.
const GET_TRANSACTION = (txn_id) => `query {
  getTransaction(id: "${txn_id}") {
    signerPublicKey
    asset
  }
}`;


const searchBtn = document.getElementById('searchBtn');
const resultEl = document.getElementById('result');

searchBtn.addEventListener('click', async () => {
  const txnId = document.getElementById('txnId').value.trim();
  if (!txnId) {
    alert('Please enter a Transaction ID');
    return;
  }

  resultEl.textContent = 'Loading...';

  try {
    const response = await sendRequest(GET_TRANSACTION(txnId));
    if (response.errors) {
      resultEl.textContent =
        'GraphQL Error: ' + JSON.stringify(response.errors, null, 2);
      return;
    }
    
    const transaction = response.data.getTransaction;
    let assetData = transaction.asset;

    // If assetData has a 'data' property, use that.
    if (assetData && assetData.data) {
      assetData = assetData.data;
    } else if (typeof assetData === 'string') {
      // If assetData is a JSON string, parse it.
      assetData = JSON.parse(assetData);
    }

    console.log('Asset data:', assetData);

    // Build the HTML content for display.
    const htmlContent = `
      <div class="asset-card">
        <h2>${assetData.Name || ''}</h2>
        <p><strong>Event Type:</strong> ${assetData.EventType || ''}</p>
        <p><strong>Description:</strong> ${assetData.Description || ''}</p>
        <p><strong>Output Products:</strong> ${assetData.OutputProducts || ''}</p>
        <p><strong>By Products:</strong> ${assetData.ByProducts || ''}</p>
        <p><strong>Timestamp:</strong> ${
          assetData.Timestamp ? new Date(assetData.Timestamp).toLocaleString() : ''
        }</p>
        <p><strong>Input Product:</strong> ${assetData.InputProduct || ''}</p>
        <p><strong>Product Quantity:</strong> ${assetData.ProductQuantity || ''}</p>
        <p><strong>Byproduct Quantity:</strong> ${assetData.ByproductQuantity || ''}</p>
        <p><strong>Industry:</strong> ${assetData.Industry || ''}</p>
        <p><strong>Claimed Byproducts:</strong> ${assetData.ClaimedByproducts || ''}</p>
      </div>
    `;

    resultEl.innerHTML = htmlContent;
  } catch (error) {
    resultEl.textContent = 'Error: ' + error.message;
  }
});
