import axios from 'axios';

export const sendRequest = async (query) => {
    const headers = {
        'Content-Type': 'application/json'
    };
    const data = {
      query: query
    }
    // TODO: Adding the path to env
    const response = await axios.post('https://cloud.resilientdb.com/graphql', data, { headers })
    return response.data;
};
