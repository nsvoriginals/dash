import React from 'react';
import { Button } from './common/Button';

export default function ExperienceForm({ formData, handleArrayChange, addItem, removeItem }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-white">Experience</h2>
        <Button 
          text="Add Experience" 
          onClick={() => addItem("experience")}
          variant="secondary"
          className="text-sm px-3 py-1"
        />
      </div>
      
      {formData.experience.map((exp, index) => (
        <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium">Experience #{index + 1}</h3>
            {formData.experience.length > 1 && (
              <button
                onClick={() => removeItem(index, "experience")}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-white font-medium">Company</label>
              <input
                type="text"
                name="company"
                value={exp.company}
                onChange={(e) => handleArrayChange(e, index, "experience")}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Company Name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-white font-medium">Position</label>
              <input
                type="text"
                name="position"
                value={exp.position}
                onChange={(e) => handleArrayChange(e, index, "experience")}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Job Title"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Duration</label>
            <input
              type="text"
              name="duration"
              value={exp.duration}
              onChange={(e) => handleArrayChange(e, index, "experience")}
              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Jan 2020 - Present"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Description</label>
            <textarea
              name="description"
              value={exp.description}
              onChange={(e) => handleArrayChange(e, index, "experience")}
              className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      ))}
    </div>
  );
} 