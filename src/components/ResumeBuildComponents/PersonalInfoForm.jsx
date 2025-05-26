import React from 'react';

export default function PersonalInfoForm({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Personal Details</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-white font-medium">Full Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="John Doe"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-white font-medium">Email Address*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="john.doe@example.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-white font-medium">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="+1 234 567 8900"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-white font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="New York, NY"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-white font-medium">Bio / Summary</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Write a brief introduction about yourself..."
        />
      </div>
    </div>
  );
} 