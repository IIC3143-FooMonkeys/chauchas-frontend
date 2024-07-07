import React from 'react';
import DiscountPreview from './DiscountPreview';

const DiscountList = ({ Discounts }) => {
  if (!Array.isArray(Discounts)) {
    return <div>No Discounts available</div>; // Mensaje alternativo si no es un array
  }
  return (
    <div>
      {Discounts.map((Discount) => (
        <DiscountPreview
          key={Discount.id}
          title={Discount.title}
          discountCover={Discount.covers[0]}
          discountLogo={Discount.covers[1]} 
          description={Discount.description} 
          category={Discount.category}
          id={Discount.id}
        />
      ))}
    </div>
  );
};

export default DiscountList;