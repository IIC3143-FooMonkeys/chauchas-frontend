import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap';

const Discount = () => {
  const { discountId } = useParams()
  const [discount, setDiscount] = useState(null)

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await fetch(`https://9ywm0s7211.execute-api.us-east-1.amazonaws.com/chauchas/discounts/${discountId}`);
        const data = await response.json();
        setDiscount(data);
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchDiscount()
  }, [discountId])

  if (!discount) {
    return <div>Loading...</div>
  }

  return (
    <Row className="justify-content-center">
        <Col md={6}>
        <Card>
        <Card.Body>
          <Card.Header as="h5">{discount.local}</Card.Header>
          <Row>
            <Col xs={12} md={6}>
            <Card.Img variant="top" src={discount.imageUrl} alt="Descuento" className="w-50"/>
            </Col>
           <Col xs={12} md={6}> 
            <Card.Text style={{ textAlign: 'left' }}>
                <strong>Descuento:</strong> {discount.discount}% de descuento<br/>
                <strong>Descripción:</strong> {discount.description}<br/>
                <strong>Válido hasta:</strong> {new Date(discount.expiration).toLocaleDateString()}<br/>
                <strong>Días:</strong> {discount.days}<br/>
                <strong>Tarjeta:</strong> {discount.cardType} - {discount.paymentMethod}<br/>
                <strong>Banco:</strong> {discount.bankName}
            </Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      </Col>
    </Row>
  )
}

export default Discount
