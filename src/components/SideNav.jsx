import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider'; 
import '../css/SideNav.css'; 

const SideNav = () => {
    const { logout } = useContext(AuthContext); 
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout(); 
    };

    const toggleSideNav = () => {
        setIsOpen(!isOpen); 
    };

    return (
        <>
            <div className={`sidenav ${isOpen ? 'open' : ''}`}>
                <ul className="nav-links">
                    <li className="logout">
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
            <button className="toggle-btn" onClick={toggleSideNav}>
                {isOpen ? 'Close' : 'Account'}
            </button>
        </>
    );
};

export default SideNav;
