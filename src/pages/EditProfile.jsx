import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import LogoutModal from '../components/LogoutModal';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import editUserIcon from '../assets/editUser.svg';
import emailIcon from '../assets/email.svg';
import logoutIcon from '../assets/logout.svg';
import editBG from '../assets/editBG.svg';
import arrowLeft from '../assets/arrowLeft.svg';
import closeCircle from '../assets/closeCircle.svg';

const EditProfile = () => {
    const { user, updateUser, logout } = useAuth();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        userName: user?.name || '',
        email: user?.email || '',
        profilePhoto: user?.profilePhoto || ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Fetch fresh user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiService.getCurrentUser();
                if (response.success) {
                    const userData = response.data.user;
                    updateUser(userData);
                    setFormData({
                        userName: userData.name || '',
                        email: userData.email || '',
                        profilePhoto: userData.profilePhoto || ''
                    });
                    setPreviewUrl(userData.profilePhoto || null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                userName: user?.name || '',
                email: user?.email || '',
                profilePhoto: user?.profilePhoto || ''
            });
            setPreviewUrl(user?.profilePhoto || null);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeletePhoto = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData(prev => ({
            ...prev,
            profilePhoto: ''
        }));
    };

    const handleEditProfile = () => {
        setIsEditMode(true);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setUploadError(null);

            let profilePhotoUrl = user?.profilePhoto || null;

            // If a new file is selected, upload it first
            if (selectedFile) {
                const uploadResponse = await apiService.uploadProfilePhoto(selectedFile);
                
                if (uploadResponse.success) {
                    profilePhotoUrl = uploadResponse.data.profilePhoto;
                    setPreviewUrl(profilePhotoUrl);
                }
            }

            // Update profile data (name, email, etc.)
            const profileData = {
                name: formData.userName,
                email: formData.email,
            };

            const updateResponse = await apiService.updateProfile(profileData);
            
            if (updateResponse.success) {
                // Update user data in context with latest data from backend
                const updatedUser = {
                    ...updateResponse.data.user,
                    profilePhoto: profilePhotoUrl
                };
                updateUser(updatedUser);
                setIsEditMode(false);
                setSelectedFile(null);
            } else {
                setUploadError(updateResponse.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setUploadError(error.message || 'Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
        // Reset form data to original user values
        setFormData({
            userName: user?.name || '',
            email: user?.email || '',
            profilePhoto: user?.profilePhoto || ''
        });
        setSelectedFile(null);
        setPreviewUrl(user?.profilePhoto || null);
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        // Handle logout logic through AuthContext
        logout();
    };

    return (
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:py-8 ">
                {/* Navigation */}
                <div className=" flex justify-between items-center pb-4" >
                    <button
                        className="flex items-center gap-2 text-primary hover:text-secondary transition-colors cursor-pointer"
                        onClick={() => window.history.back()}
                    >
                        <img src={arrowLeft} alt="Arrow Left" className="w-5 h-5" />
                        <span className="text-sm font-medium">Edit Profile</span>
                    </button>

                    {/* Logout Button */}
                    <div className="flex justify-end border border-[#0F100B24] rounded-lg px-4 py-2">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-primary transition-colors text-sm font-medium cursor-pointer"
                        >
                            <img src={logoutIcon} alt="Logout" className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Profile Information Card */}
                <div className="rounded-2xl border-common p-6 sm:p-8 relative overflow-hidden">

                    {/* Card Header */}
                    <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-primary">Profile Information</h2>
                        {!isEditMode && (
                            <button
                                onClick={handleEditProfile}
                                className="flex items-center gap-2  text-primary 
                                transition-colors text-sm font-medium cursor-pointer"
                            >
                                <img src={editUserIcon} alt="Edit" className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Profile Display */}
                    <div className="relative z-10 text-center mb-8">
                            <img src={editBG} alt="Background" className="absolute inset-0 opacity-60"/>  
                        {/* Profile Picture */}
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden relative cursor-pointer group">
                                {/* Background Pattern Inside Profile Picture */}
                                <img 
                                    src={previewUrl || user?.profilePhoto}
                                    alt={formData.userName || "User"}
                                    className="w-full h-full object-cover relative z-10"
                                />
                                
                                {/* Upload Overlay (only in edit mode) */}
                                {isEditMode && (
                                    <div className="absolute inset-0 bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <div className="text-center text-white">
                                            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="text-xs">Change Photo</span>
                                        </div>
                                    </div>
                                )}

                                {/* Delete Button (always show in edit mode for testing) */}
                                {isEditMode && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePhoto();
                                        }}
                                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors z-50 cursor-pointer"
                                        title="Delete Photo"
                                    >
                                        <img src={closeCircle} alt="Delete" className="w-5 h-5" />
                                    </button>
                                )}
                                
                                {/* Hidden File Input */}
                                {isEditMode && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                                    />
                                )}
                            </div>
                        </div>


                        {/* User Name */}
                        <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">
                            {formData.userName}
                        </h3>

                        {/* Email with Icon */}
                        <div className="flex items-center justify-center gap-2 text-secondary">
                            <img src={emailIcon} alt="Email" className="w-4 h-4" />
                            <span className="text-sm">{formData.email}</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        {/* User Name Field */}
                        <div>
                            <Input
                                id="userName"
                                name="userName"
                                label="User Name"
                                type="text"
                                value={formData.userName}
                                onChange={handleInputChange}
                                placeholder="Enter user name"
                                disabled={!isEditMode}
                            />
                        </div>

                        {/* Email Address Field */}
                        <div>
                            <Input
                                id="email"
                                name="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                disabled={!isEditMode}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditMode && (
                        <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 border border-[#0F100B] text-primary rounded-full text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <Button
                                onClick={handleSave}
                                className="px-6 py-3"
                            >
                                Save
                            </Button>
                        </div>
                    )}
                </div>

                {/* Logout Modal */}
                <LogoutModal
                    isOpen={isLogoutModalOpen}
                    onClose={() => setIsLogoutModalOpen(false)}
                    onConfirm={handleConfirmLogout}
                />
        </div>
    );
};

export default EditProfile;
