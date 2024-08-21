import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import '../css/UserInfo.css';

const UserInfo = () => {
    const { authState } = useContext(AuthContext);

    if (!authState.user) {
        return null;
    }

    const { username, avatar } = authState.user;

    return (
        <div className="user-info">
            <img src={avatar} alt="User Avatar" className="user-avatar" />
            <span className="username">{username}</span>
        </div>
    );
};

export default UserInfo;
