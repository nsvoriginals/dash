import React from 'react';
import { Button } from './common/Button';

export default function ProjectsForm({ formData, handleArrayChange, addItem, removeItem }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-white">Projects</h2>
        <Button 
          text="Add Project" 
          onClick={() => addItem("projects")}
          variant="secondary"
          className="text-sm px-3 py-1"
        />
      </div>
      
      {formData.projects.map((project, index) => (
        <div key={index} className="bg-[#242424] p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium">Project #{index + 1}</h3>
            {formData.projects.length > 1 && (
              <button
                onClick={() => removeItem(index, "projects")}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Project Title</label>
            <input
              type="text"
              name="title"
              value={project.title}
              onChange={(e) => handleArrayChange(e, index, "projects")}
              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Project Name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Description</label>
            <textarea
              name="description"
              value={project.description}
              onChange={(e) => handleArrayChange(e, index, "projects")}
              className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Describe your project..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Technologies Used</label>
            <input
              type="text"
              name="technologies"
              value={project.technologies}
              onChange={(e) => handleArrayChange(e, index, "projects")}
              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="React, Node.js, MongoDB, etc."
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Project Link</label>
            <input
              type="url"
              name="link"
              value={project.link}
              onChange={(e) => handleArrayChange(e, index, "projects")}
              className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="https://github.com/username/project"
            />
          </div>
        </div>
      ))}
    </div>
  );
} 