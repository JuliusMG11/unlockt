import React, { useRef } from 'react';
import './m-copy-link.css'

interface LinkSectionProps {
  link: string;
}

const LinkSection: React.FC<LinkSectionProps> = ({ link }) => {
  const linkRef = useRef<HTMLSpanElement>(null);

  const copyToClipboard = () => {
    if (linkRef.current) {
      navigator.clipboard.writeText(linkRef.current.innerText).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  };

  return (
    <div className="m-copy-link">
      <span ref={linkRef}>{link}</span>
      <div className="copy-btn">
        <button onClick={copyToClipboard}>copy link</button>
      </div>
    </div>
  );
};

export default LinkSection;