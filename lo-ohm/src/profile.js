import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import Header from './Header';  // Add this import
import logo from './LoOhmWh.png';

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        profilePicture: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setProfile(data);
            setNewUsername(data.username || '');
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage('Error loading profile data');
        } finally {
            setIsLoading(false);
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
            
            if (response.ok) {
                setProfile(prev => ({ 
                    ...prev, 
                    profilePicture: `data:image/jpeg;base64,${data.pictureUrl}` 
                }));
                setMessage('Profile picture updated successfully');
            } else {
                setMessage(data.message || 'Error uploading profile picture');
            }
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
                {isLoading ? (
                    <p>Loading profile...</p>
                ) : (
                    <>
                        {message && <p className="message">{message}</p>}
                        <div className="profile-info">
                            <div className="profile-picture">
                            <img 
                                src={profile.profilePicture ? 
                                    profile.profilePicture.startsWith('data:image') ? 
                                        profile.profilePicture : 
                                        `data:image/jpeg;base64,${profile.profilePicture}` 
                                    : 'pfp.jpg'  // Use default profile picture
                                } 
                                alt="Profile" 
                                className="profile-image"
                            />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handlePictureUpload} 
                                    className="file-input"
                                />
                            </div>

                            <div className="profile-details">
                                {!isEditing ? (
                                    <>
                                        <p><strong>Username:</strong> {profile.username}</p>
                                        <p><strong>Email:</strong> {profile.email}</p>
                                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                                    </>
                                ) : (
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
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Profile;
