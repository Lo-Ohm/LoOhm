import React, { useState, useEffect } from 'react';
import './Profile.css';
import Header from './Header';  // Add this import
import logo from './LoOhmWh.png';

function Profile() {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        profilePicture: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:5000/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handlePictureUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const response = await fetch('http://localhost:5000/profile/picture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            const data = await response.json();
            setProfile(prev => ({ ...prev, profilePicture: data.pictureUrl }));
            setMessage('Profile picture updated successfully');
        } catch (error) {
            setMessage('Error uploading profile picture');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    username: newUsername || profile.username,
                    password: newPassword
                })
            });
            const data = await response.json();
            setMessage(data.message);
            setIsEditing(false);
            if (response.ok) {
                setProfile(prev => ({ ...prev, username: newUsername || prev.username }));
            }
        } catch (error) {
            setMessage('Error updating profile');
        }
    };

    return (
        <div className="profile-container">
            <Header />
            <main className="profile-content">
                <h1>Profile</h1>
                <div className="profile-info">
                    <div className="profile-picture">
                        <img 
                            src={profile.profilePicture || 'default-profile.png'} 
                            alt="Profile" 
                        />
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handlePictureUpload} 
                        />
                    </div>

                    <div className="profile-details">
                        <p><strong>Username:</strong> {profile.username}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        
                        <button onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>

                        {isEditing && (
                            <form onSubmit={handleUpdateProfile}>
                                <input
                                    type="text"
                                    placeholder="New Username"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button type="submit">Save Changes</button>
                            </form>
                        )}

                        {message && <p className="message">{message}</p>}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;
