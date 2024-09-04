// Create an SVG component with color props

import React from 'react';
import './a-global-btn.css';

const AGlobalBtn = ({ type, text }) => (
  <button className={`a-global-btn ${type}`}>
    {text}
  </button>
);

export default AGlobalBtn;