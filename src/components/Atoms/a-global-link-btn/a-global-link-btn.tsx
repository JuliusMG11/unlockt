import React from 'react';
import './a-global-link-btn.css'; // Predpokladáme, že štýly sú definované v tomto CSS súbore

interface Props {
    url: string;
    label: string;
    type: 'primary' | 'secondary';
    arrow: boolean
  }

const GlobalLinkBtn = ({ url, label, type, arrow }) => {
  return (
    <a href={url} className={`global-link-btn ${type}`}>
      {label}
      {arrow ? <span className="arrow">❯</span> : null}
    </a>
  );
};


export default GlobalLinkBtn;