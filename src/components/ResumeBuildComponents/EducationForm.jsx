import React from 'react';
import { Button } from './common/Button';

export default function EducationForm({ formData, handleArrayChange, addItem, removeItem }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-white">Education</h2>
        <Button 
          text="Add Education" 
          onClick={() => addItem("education")}
          variant="secondary"
          className="text-sm px-3 py-1"
        />
      </div>
      
      {formData.education.map((edu, index) => (
        <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium">Education #{index + 1}</h3>
            {formData.education.length > 1 && (
              <button
                onClick={() => removeItem(index, "education")}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-white font-medium">Institution</label>
              <input
                type="text"
                name="institution"
                value={edu.institution}
                onChange={(e) => handleArrayChange(e, index, "education")}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="University Name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-white font-medium">Degree</label>
              <input
                type="text"
                name="degree"
                value={edu.degree}
                onChange={(e) => handleArrayChange(e, index, "education")}
                className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Bachelor of Science"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Year</label>
            <input
              type="text"
              name="year"
              value={edu.year}
              onChange={(e) => handleArrayChange(e, index, "education")}
              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="2016 - 2020"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Description</label>
            <textarea
              name="description"
              value={edu.description}
              onChange={(e) => handleArrayChange(e, index, "education")}
              className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Describe your studies, achievements, etc."
            />
          </div>
        </div>
      ))}
    </div>
  );
} 