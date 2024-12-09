import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { formatPrice } from '../../../utyls/formatPrice';
import { calculateExpiryDate } from '../../../utyls/calculateExpiryDate';
import { formatDate } from '../../../utyls/formatDate';

import './m-post-box.css';

import payIcon from '../../../assets/icons/price-icon.svg';
import payCounter from '../../../assets/icons/view-icon.svg';
import audioIcon from '../../../assets/icons/music-icon.svg';
import documentIcon from '../../../assets/icons/document-icon.svg';

interface PostData {
    id: string;
    image_url: string
    createdAt: number
    price: number
    counter_show_image: number
    is_sound: boolean
    is_document: boolean
}

const PostBox: React.FC<PostData> = ({id, image_url, createdAt, price, counter_show_image, is_sound, is_document}) => {

    // LOADER IMAGE
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [viewCount, setViewCount] = useState(counter_show_image);
    
    useEffect(() => {
        setViewCount(counter_show_image);
    }, [counter_show_image]);
    
    return (
        <div className='m-post-box'>
             <Link className='m-post-box__item' to={`/post/${id}`}> 
                <div className="m-post-box__content">
                    <div className='m-post-box__content--image'>
                        {is_sound ? (
                            <img 
                                className='icon'
                                src={audioIcon} 
                                alt="Audio Icon" 
                                onLoad={() => setIsImageLoaded(true)} 
                                style={{ backgroundColor: isImageLoaded ? 'transparent' : '#ffffff' }}
                            />
                        ) : is_document ? (
                            <img 
                                className='icon'
                                src={documentIcon} 
                                alt="Document Icon" 
                                onLoad={() => setIsImageLoaded(true)} 
                                style={{ backgroundColor: isImageLoaded ? 'transparent' : '#ffffff' }}
                            />
                        ) : (
                            <img 
                                className='image'
                                src={image_url} 
                                alt="" 
                                onLoad={() => setIsImageLoaded(true)} 
                                style={{ backgroundColor: isImageLoaded ? 'transparent' : '#ffffff' }}
                            />
                        )}
                    </div>
                    <div className='m-post-box__content--dates'>
                        <h3>{formatDate(createdAt)}</h3>
                        <span>Expired {calculateExpiryDate(createdAt)}</span>
                    </div>
                </div>

                <div className="m-post-box__info">
                    <div className='m-post-box__info--item'>
                        <img src={payIcon} alt="" />
                        <h3>{ formatPrice(price) }</h3>
                    </div>
                    <div className="m-post-box__info--item">
                        <img src={payCounter} alt="" />
                        <h3>{viewCount}</h3>
                    </div>
                </div>

            </Link>
        </div>
    )
}

export default PostBox;