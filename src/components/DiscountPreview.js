import React from 'react';
import { Link } from 'react-router-dom';
import '../css/DiscountPreview.css'

const DiscountPreview = ({ title, discountCover, discountLogo, description, category, id }) => {
  return (
    <Link to={`/Discounts/${id}`} className='Discount-link'>
      <div className="Discount">
        <div className="Discount-column">
          <div className="Discount-info">
            <img src={discountCover} alt={title} />
          </div>
          <div className="Discount-info">
            <img src={discountLogo} alt={title} />
          </div>
        </div>
        <div className="Discount-column">
          <div className="Discount-details">
            <div className="Discount-row">
              <p><strong>{title}</strong></p>
            </div>
            <div className="Discount-row">
              <p><strong>{description}</strong></p>
            </div>
            <div className="Discount-row">
              <p><strong>{category}</strong></p>
            </div>
          </div>
        </div>
        <div className="Discount-column">
        </div>
      </div>
    </Link>
  );
};

export default DiscountPreview;
