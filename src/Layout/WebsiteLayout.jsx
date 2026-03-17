import React from 'react'
import Header from '../components/syaraLandingPage/Header'
import Footer from '../components/syaraLandingPage/Footer';
import { Outlet } from 'react-router-dom';

const WebsiteLayout = () => {
    return (
        <div style={{ fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif", background: '#fff' }}>
            <Header />
                <Outlet/>
            <Footer /> 
        </div>
    )
}

export default WebsiteLayout