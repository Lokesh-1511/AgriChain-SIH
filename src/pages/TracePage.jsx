import React from 'react';
import { useParams } from 'react-router-dom';

const TracePage = () => {
  const { productId } = useParams();
  
  return (
    <div>
      <h1>Trace Page</h1>
      <p>Product ID: {productId}</p>
    </div>
  );
};

export default TracePage;