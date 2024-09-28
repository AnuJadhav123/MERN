import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function UserLayout() {
    const user = useSelector((state) => state.Auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div className="user-layout">
            {user && (
                <div className="user-card">
                <h2>Welcome,<br></br> {user.name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>    
                </div>
            )}
            <Outlet />
        </div>
    );
}
