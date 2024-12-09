import React from 'react';

import './m-title-header.css';


interface TitleData {
   title: string
}

const TitleHeader: React.FC<TitleData> = ({title}) => {
    
    
    return (
        <div className='m-title-header'>
             <h2>{title}</h2>
        </div>
    )

}

export default TitleHeader; 