import React, { useState } from 'react';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import LogoutModal from '../components/LogoutModal';
import editUserIcon from '../assets/editUser.svg';
import emailIcon from '../assets/email.svg';
import logoutIcon from '../assets/logout.svg';
import editBG from '../assets/editBG.svg';
import arrowLeft from '../assets/arrowLeft.svg';

const EditProfile = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        userName: 'Emma Watson',
        email: 'emma08@example.com'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditProfile = () => {
        setIsEditMode(true);
    };

    const handleSave = () => {
        setIsEditMode(false);
        // Here you would typically save the data
        console.log('Profile saved:', formData);
    };

    const handleCancel = () => {
        setIsEditMode(false);
        // Reset form data to original values
        setFormData({
            userName: 'Emma Watson',
            email: 'emma08@example.com'
        });
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        // Here you would typically handle the logout logic
        console.log('User logged out');
        // Redirect to login page or perform logout action
    };

    return (
        <div className="min-h-screen bg-[#FBFFF5]">
            <Header />

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:py-8 ">
                {/* Navigation */}
                <div className=" flex justify-between items-center pb-4" >
                    <button
                        className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
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
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden relative">
                                {/* Background Pattern Inside Profile Picture */}
                                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                                    alt="Emma Watson"
                                    className="w-full h-full object-cover relative z-10"
                                />
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
        </div>
    );
};

export default EditProfile;
