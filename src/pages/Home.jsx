import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AddBookModal from "../components/AddBookModal";
import { useBooks } from "../hooks/useBooks";
import apiService from "../services/api";
import BookIcon from "../assets/books.svg";
import ProfileIcon from "../assets/profile.svg";
import SubscriptionIcon from "../assets/subscriptions.svg";
import DollarIcon from "../assets/dollor.svg";
import PlusIcon from "../assets/plus.svg";
import Dollar2Icon from "../assets/dollor2.svg";
import ArrowIcon from "../assets/altArrowRight.svg";
import DailyActivities from "../assets/book2.svg";
import ProfileIcon1 from "../assets/profile2.svg";
import CrownIcon from "../assets/premium.svg";
 
export default function Dashboard() {
  const navigate = useNavigate();
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const { books, isLoading, error, createBook } = useBooks();
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalBooks: 0,
    activeUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0
  });

  // Fetch dashboard statistics and users
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users
        const usersResponse = await apiService.getUsers();
        const allUsers = usersResponse.data?.users || [];
        const activeUsers = allUsers.length;

        // Store top 5 latest users for display
        const latestUsers = allUsers
          .slice(0, 5)
          .map(user => ({
            name: user.name || 'Unknown User',
            email: user.email || '',
            avatar: user.profilePhoto || null,
            type: user.isPremium ? 'Premium' : 'Free'
          }));
        
        setUsers(latestUsers);

        const activeSubscriptions = 0;
        const totalRevenue = 0;

        setDashboardStats({
          totalBooks: books.length, 
          activeUsers,
          activeSubscriptions,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    // Only fetch if books are loaded
    if (!isLoading) {
      fetchStats();
    }
  }, [books, isLoading]); // Refetch when books change or loading completes

  // Dynamic stats array - use books.length directly for real-time updates and remove the // Kept for future use comment
  const stats = [
    { icon: BookIcon, value: books.length, label: "Books Published" },
    { icon: ProfileIcon, value: dashboardStats.activeUsers.toLocaleString(), label: "Active Users" },
    { icon: SubscriptionIcon, value: dashboardStats.activeSubscriptions, label: "Active Subscriptions" },
    { icon: DollarIcon, value: `$${dashboardStats.totalRevenue.toLocaleString()}`, label: "Revenue" },
  ];
  
  // Transform API books to display format and show only top 5 and remove the // Kept for future use comment
  const displayBooks = books
    .slice(0, 5)
    .map(book => ({
      img: book.coverImage || DailyActivities,
      title: book.name,
      type: book.type === 'free' ? 'Free' : 'Premium',
      price: book.type === 'premium' ? `$${book.price}` : null,
      id: book._id
    }));

  const handleAddNewBook = () => {
    setIsAddBookModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddBookModalOpen(false);
  };

  const handleAddBook = async (bookData) => {
    try {
      const result = await createBook(bookData);
      if (result.success) {
        setIsAddBookModalOpen(false);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create book'
      };
    }
  };

  const handleManagePlans = () => {
    navigate('/plans');
  };

  const handleViewAllBooks = () => {
    navigate('/books');
  };

  const handleViewAllUsers = () => {
    navigate('/users');
  };

  const handleStatsClick = (label) => {
    switch(label) {
      case 'Books Published':
        navigate('/books');
        break;
      case 'Active Users':
        navigate('/users');
        break;
      case 'Active Subscriptions':
        navigate('/subscriptions');
        break;
      case 'Revenue':
        navigate('/subscriptions');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFFF5]">
      <Header />
      <div className="max-w-7xl mx-auto px-10 py-4">
        <div className="mb-6">
          <h1 className="text-2xl tracking-tighter font-semibold">
            Hey, Emma
          </h1>
          <p className="text-gray-500">
            Let's manage your dashboard effortlessly
          </p>
        </div>
 
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              onClick={() => handleStatsClick(stat.label)}
              className="rounded-2xl py-5 px-4 gap-4 flex items-center border-common cursor-pointer transition-colors"
            >
              <img
                src={stat.icon}
                alt={stat.label}
                className="w-12 h-12"
              />
              <div>
                <div className="text-lg sm:text-2xl font-bold text-[#0F100B]">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-500">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="rounded-2xl p-4 sm:p-5 flex items-center justify-between border-common ">
            <div className="flex items-center"
            >
              <button 
                className="rounded-full mr-3 sm:mr-4 cursor-pointer"
              >
                <img
                  src={PlusIcon}
                  alt="Add"
                  className="w-12 h-12"
                />
              </button>
              <span className="font-semibold text-base sm:text-xl">
                Add New Book
              </span>
            </div>
            <div onClick={handleAddNewBook} 
              className="cursor-pointer"
              > 
            <img
              src={ArrowIcon}
              alt="Arrow"
              className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
            />
            </div>
          </div>
 
          <div className="rounded-2xl p-4 sm:p-5 flex items-center justify-between border-common ">
            <div className="flex items-center">
              <button 
                className="rounded-full mr-3 sm:mr-4 cursor-pointer"
              >
                <img
                  src={Dollar2Icon}
                  alt="Manage Plans"
                  className="w-12 h-12"
                />
              </button>
              <span className="font-semibold text-base sm:text-xl">
                Manage Plans
              </span>
            </div>
            <div onClick={handleManagePlans} className="cursor-pointer">
            <img
              src={ArrowIcon}
              alt="Arrow"
              className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
            />
            </div>
          </div>
        </div>
 
        {/* Books and Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] ">
          {/* Recent Books */}
 
          <div className="rounded-2xl py-4 px-4 border-common ">
            <div className="flex justify-between items-center mb-2">
              <span className=" font-semibold text-xl">
                Recent Books
              </span>
              <span 
                onClick={handleViewAllBooks}
                className="text-[#0F100B] opacity-60 text-medium cursor-pointer hover:opacity-80 transition-opacity"
              >
                View All Books
              </span>
            </div>
            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-primary">Loading books...</span>
                </div>
            )}

            {/* Error State - Only show for initial data loading, not for form submissions */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3x` rounded mb-4">
                    Error loading books: {error}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && displayBooks.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No books found</p>
                </div>
            )}

            {/* Books List */}
            {!isLoading && !error && displayBooks.length > 0 && (
                <div>
                    {displayBooks.map((book, i) => (
                <div
                  key={i}
                  className={`flex items-center py-2 px-3 rounded-lg mb-2 flex-wrap sm:flex-nowrap ${
                    i % 2 === 0 ? "bg-[#F3F8EC]" : ""
                  }`}
                >
                  <img
                    src={book.img}
                    alt={book.title}
                    className="w-10 h-12 rounded mr-3"
                  />
                  <span className="flex-1 font-semibold">
                    {book.title}
                  </span>
                  {book.type === "Free" ? (
                    <span className="bg-[#0F100B0F] text-[#0F100B] opacity-70 px-3 py-1 rounded-full text-sm font-semibold">
                      Free
                    </span>
                  ) : (
                    <span className="inline-flex items-center border border-[#FFAA39] text-[#FFAA39] px-3 py-1 rounded-full gap-[6px] text-sm font-medium w-[133px] h-[22px] whitespace-nowrap">
                      <img src={CrownIcon} alt="Premium badge icon" />
                      Premium{" "}
                      <span className="text-black ml-1">{book.price}</span>
                    </span>
                  )}
                </div>
              ))}
                </div>
            )}
          </div>
 
          {/* Latest Users */}
          <div className="w-full max-w-[631px]  mx-auto overflow-hidden">
            <div className=" rounded-2xl px-5 py-4 border-common ">
              <div className="flex justify-between items-center mb-2 ">
                <span className=" font-semibold text-xl">
                  Latest Users
                </span>
                <span 
                  onClick={handleViewAllUsers}
                  className="text-[#0F100B] opacity-60 text-medium cursor-pointer hover:opacity-80 transition-opacity"
                >
                  View All Users
                </span>
              </div>
              {/* Users Loading State */}
              {isLoading && (
                  <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-primary text-sm">Loading users...</span>
                  </div>
              )}

              {/* Users Error State */}
              {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
                      Error loading users: {error}
                  </div>
              )}

              {/* Users Empty State */}
              {!isLoading && !error && users.length === 0 && (
                  <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No users found</p>
                  </div>
              )}

              {/* Users List */}
              {!isLoading && !error && users.length > 0 && (
                  <div>
                      {users.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center py-2 px-3 border-b rounded-lg mb-0 border-gray-200 last:border-b-0 flex-wrap sm:flex-nowrap"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full mr-3 bg-gray-100 flex items-center justify-center">
                        <img 
                          src={ProfileIcon1} 
                          alt="Default Profile" 
                          className="w-5 h-5 opacity-60"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500  max-w-[140px] ">
                        {user.email}
                      </div>
                    </div>
                    {user.type === "Free" ? (
                      <span className="bg-[#0F100B0F] text-[#0F100B] opacity-70 px-3 py-1 rounded-full text-sm font-semibold">
                        Free
                      </span>
                    ) : (
                      <span className="inline-flex items-center border border-[#FFAA39] text-[#FFAA39] px-2 py-[2px] rounded-full gap-1 text-sm font-medium min-w-[60px] h-[20px] whitespace-nowrap">
                        {" "}
                        <img src={CrownIcon} alt="Premium" />
                        Pro
                      </span>
                    )}
                  </div>
                ))}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddBook}
      />
    </div>
  );
}