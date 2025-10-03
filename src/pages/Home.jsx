import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AddBookModal from "../components/AddBookModal";
import BookIcon from "../assets/books.svg";
import ProfileIcon from "../assets/profile.svg";
import SubscriptionIcon from "../assets/subscriptions.svg";
import PremiumIcon from "../assets/premium.svg";
import DollarIcon from "../assets/dollor.svg";
import PlusIcon from "../assets/plus.svg";
import Dollar2Icon from "../assets/dollor2.svg";
import ArrowIcon from "../assets/altArrowRight.svg";
 
import DailyActivities from "../assets/book2.svg";
import FarmAnimals from "../assets/book4.svg";
import Dinosaur from "../assets/book4.svg";
import DotNumbers from "../assets/book5.svg";
import FarmAnimal from "../assets/book6.svg";

import User from "../assets/profile2.svg";

import CrownIcon from "../assets/premium.svg";
 
const stats = [
  { icon: BookIcon, value: 12, label: "Books Published" },
  { icon: ProfileIcon, value: "1,240", label: "Active Users" },
  { icon: SubscriptionIcon, value: 340, label: "Active Subscriptions" },
  { icon: DollarIcon, value: "$4,560", label: "Revenue" },
];
 
const books = [
  { img: DailyActivities, title: "Daily Activities", type: "Free" },
  {
    img: FarmAnimals,
    title: "Farm Animals Coloring Booklet",
    type: "Premium",
    price: "$99",
  },
  { img: Dinosaur, title: "Original Dinosaur", type: "Free" },
  { img: DotNumbers, title: "Dot The Numbers Coloring Book", type: "Free" },
  {
    img: FarmAnimal,
    title: "Farm Animals Coloring Booklet",
    type: "Premium",
    price: "$89",
  },
];
 
const users = [
  {
    name: "Leon Brakus",
    email: "leonbrakus08@example.com",
    avatar: User,
    type: "Free",
  },
  {
    name: "Opal Schiller",
    email: "opalschiller08@example.com",
    avatar: User,
    type: "Pro",
  },
  {
    name: "Estelle Zieme",
    email: "estellezieme@example.com",
    avatar: User,
    type: "Free",
  },
  {
    name: "Toni Oberbrunner",
    email: "tonioberbrunner08@example.com",
    avatar: User,
    type: "Pro",
  },
  {
    name: "Jeremy Cummerata",
    email: "jeremycummerata08@example.com",
    avatar: User,
    type: "Free",
  },
  {
    name: "Lana Willms Sr.",
    email: "lanawillms08@example.com",
    avatar: User,
    type: "Pro",
  },
];
 
export default function Dashboard() {
  const navigate = useNavigate();
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  const handleAddNewBook = () => {
    setIsAddBookModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddBookModalOpen(false);
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
            <div className="flex items-center">
              <button 
                onClick={handleAddNewBook}
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
            <img
              src={ArrowIcon}
              alt="Arrow"
              className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
            />
          </div>
 
          <div className="rounded-2xl p-4 sm:p-5 flex items-center justify-between border-common ">
            <div className="flex items-center">
              <button 
                onClick={handleManagePlans}
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
            <img
              src={ArrowIcon}
              alt="Arrow"
              className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
            />
          </div>
        </div>
 
        {/* Books and Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] ">
          {/* Recent Books */}
 
          <div className="rounded-2xl py-5 px-[14px] border-common ">
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
            <div>
              {books.map((book, i) => (
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
          </div>
 
          {/* Latest Users */}
          <div className="w-full max-w-[631px]  mx-auto overflow-hidden">
            <div className=" rounded-2xl pt-[20px] pb-[22px] px-[14px] border-common ">
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
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    ) : (
                      <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-xl"></span>
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
            </div>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}