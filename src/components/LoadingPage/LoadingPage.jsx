import React from 'react';
import loadingGIF from '../../assets/loading.gif';
import './LoadingPage.scss';

export const LoadingPage = () => (
    <div className="loading-page">
        <img src={loadingGIF} alt="loading spinner" style={{ height: '10rem' }} />
    </div>
);
