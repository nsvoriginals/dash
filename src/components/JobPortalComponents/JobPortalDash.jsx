import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedin, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const API_KEY = "68340ddd0cb7986cff41f307";
const GEO_ID = "1007769";
const JOBS_PER_PAGE = 9;

export default function JobPortalDash() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    field: "Frontend Engineer",
    page: 1,
    sort_by: "week",
    job_type: "full_time",
    exp_level: "internship",
    work_type: "at_work",
    filter_by_company: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        api_key: API_KEY,
        field: formData.field,
        geoid: GEO_ID,
        page: page,
        sort_by: formData.sort_by,
        job_type: formData.job_type,
        exp_level: formData.exp_level,
        work_type: formData.work_type,
        filter_by_company: formData.filter_by_company
      });

      const response = await fetch(`https://api.scrapingdog.com/linkedinjobs?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);
      setTotalJobs(data.length); // Assuming the API returns total count
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.message || "Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchJobs(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.min(10, Math.ceil(totalJobs / JOBS_PER_PAGE))) {
      fetchJobs(newPage);
    }
  };

  // Calculate pagination values
  const totalPages = Math.min(10, Math.ceil(totalJobs / JOBS_PER_PAGE));
  const startJob = (currentPage - 1) * JOBS_PER_PAGE + 1;
  const endJob = Math.min(currentPage * JOBS_PER_PAGE, totalJobs);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

     return (
    <main className="flex-1 bg-[#131515] overflow-auto min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Search Form */}
          <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              Find Your Dream Job
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-white font-medium">Job Field</label>
                  <input
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g., Frontend Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-white font-medium">Job Type</label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-white font-medium">Experience Level</label>
                  <select
                    name="exp_level"
                    value={formData.exp_level}
                    onChange={handleChange}
                    className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="internship">Internship</option>
                    <option value="entry_level">Entry Level</option>
                    <option value="associate">Associate</option>
                    <option value="mid_senior">Mid-Senior</option>
                    <option value="director">Director</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-white font-medium">Work Type</label>
                  <select
                    name="work_type"
                    value={formData.work_type}
                    onChange={handleChange}
                    className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="at_work">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-white font-medium">Sort By</label>
                  <select
                    name="sort_by"
                    value={formData.sort_by}
                    onChange={handleChange}
                    className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="week">This Week</option>
                    <option value="day">Today</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-white font-medium">Company Filter</label>
                  <input
                    type="text"
                    name="filter_by_company"
                    value={formData.filter_by_company}
                    onChange={handleChange}
                    className="w-full bg-[#2b2b2b] text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Filter by company name"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Searching..." : "Search Jobs"}
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.job_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1e1e1e] rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col"
              >
                {/* Job Header with Company Logo */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    {job.company_logo_url ? (
                      <img 
                        src={job.company_logo_url} 
                        alt={`${job.company_name} logo`}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-contain bg-white p-1 flex-shrink-0"
                      />
                    ) : (
                      <FaLinkedin className="text-[#0077B5] text-xl sm:text-2xl flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-2">{job.job_position}</h3>
                      <a 
                        href={job.company_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 text-xs sm:text-sm hover:text-indigo-400 transition-colors line-clamp-1"
                      >
                        {job.company_name}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex items-center text-gray-300 text-sm">
                    <FaMapMarkerAlt className="mr-2 flex-shrink-0 text-xs sm:text-sm" />
                    <span className="line-clamp-1">{job.job_location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <FaClock className="mr-2 flex-shrink-0 text-xs sm:text-sm" />
                    <span>Posted: {new Date(job.job_posting_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>

                {/* Job Type and Level */}
                <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                  <div className="bg-[#2b2b2b] rounded-lg p-2">
                    <span className="text-gray-400 text-xs sm:text-sm">Job Type</span>
                    <p className="text-white text-xs sm:text-sm font-medium line-clamp-1">
                      {job.job_position.toLowerCase().includes('intern') ? 'Internship' :
                       job.job_position.toLowerCase().includes('graduate') ? 'Graduate' :
                       job.job_position.toLowerCase().includes('apprentice') ? 'Apprenticeship' :
                       'Full Time'}
                    </p>
                  </div>
                  <div className="bg-[#2b2b2b] rounded-lg p-2">
                    <span className="text-gray-400 text-xs sm:text-sm">Experience Level</span>
                    <p className="text-white text-xs sm:text-sm font-medium line-clamp-1">
                      {job.job_position.toLowerCase().includes('senior') ? 'Senior' :
                       job.job_position.toLowerCase().includes('junior') ? 'Junior' :
                       job.job_position.toLowerCase().includes('graduate') ? 'Entry Level' :
                       'Not Specified'}
                    </p>
                  </div>
                </div>

                {/* Job Description Preview */}
                {job.job_description && (
                  <div className="mb-3 sm:mb-4">
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-3">
                      {job.job_description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 mt-auto">
                  <a
                    href={job.job_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                  >
                    Apply on LinkedIn
                  </a>
                  <a
                    href={job.company_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#2b2b2b] text-white py-2 px-3 rounded-lg hover:bg-[#3b3b3b] transition-colors text-sm sm:text-base"
                  >
                    View Company Profile
                  </a>
                </div>

                {/* Job ID and Posted Date */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700 text-[10px] sm:text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span className="line-clamp-1">ID: {job.job_id}</span>
                    <span className="line-clamp-1">{new Date(job.job_posting_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalJobs > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm">
                Showing {startJob} to {endJob} of {totalJobs} jobs
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-[#2b2b2b] text-white hover:bg-[#3b3b3b]"
                  }`}
                >
                  <FaChevronLeft />
                </button>
                
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "bg-[#2b2b2b] text-white hover:bg-[#3b3b3b]"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-[#2b2b2b] text-white hover:bg-[#3b3b3b]"
                  }`}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && jobs.length === 0 && !error && (
            <div className="text-center text-gray-400 py-8">
              No jobs found. Try adjusting your search criteria.
        </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}