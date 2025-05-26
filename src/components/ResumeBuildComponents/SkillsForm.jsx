import React from 'react';

export default function SkillsForm({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Skills*</h2>
      <div className="space-y-2">
        <label className="block text-white font-medium">List your skills (separated by commas)</label>
        <textarea
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full h-24 bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="JavaScript, React, Node.js, CSS, HTML, etc."
        />
      </div>
    </div>
  );
} 