import React from 'react'
import Background from '../components/Background'
import { Container } from 'react-bootstrap'
import DataUploader from '../components/DataUploader'
const InventoryPage = () => {
  return (
      <Background>
        <Container 
             className="d-flex align-items-center"
             style={{minHeight: "100vh"}}>
            <div className="w-100" style={{maxWidth: '400px'}}>
                <DataUploader />
            </div>
        </Container>
    </ Background>
  )
}
export default InventoryPage; 