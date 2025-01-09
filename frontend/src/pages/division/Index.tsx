import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Division } from '../../../types/Division';
import axiosInstance from '../../utils/axios';

const Index: React.FC = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryPage = parseInt(searchParams.get('page') || '1', 10);
  const querySearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [currentPage, setCurrentPage] = useState(queryPage);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (currentPage > 1) params.set('page', String(currentPage));
    setSearchParams(params);
  }, [searchTerm, currentPage, setSearchParams]);

  useEffect(() => {
    const fetchDivisions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/divisions', {
          params: {
            name: searchTerm,
            page: currentPage,
          },
        });

        if (response.data.status === 'success') {
          setDivisions(response.data.data.divisions);

          const { total, current_page, last_page } = response.data.pagination;
          setTotal(total);
          setCurrentPage(current_page);
          setLastPage(last_page);
        } else {
          alert('Failed to fetch divisions');
        }
      } catch (error) {
        console.error('Error fetching divisions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDivisions();
  }, [searchTerm, currentPage]);

  const deleteDivision = async (id: string) => {
    if (confirm('Are you sure you want to delete this division?')) {
      try {
        const response = await axiosInstance.delete(`/divisions/${id}`);
        if (response.data.status === 'success') {
          setDivisions((prev) => prev.filter((item) => item.id !== id));
        } else {
          alert('Failed to delete division');
        }
      } catch (error) {
        console.error('Error deleting division:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-600 shadow-sm rounded-md">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Division List ({total})
      </h1>
      <div className="flex justify-between items-center mb-4">
        <Link to="create" className="bg-blue-500 text-white py-2 px-4 rounded">
          Create
        </Link>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-2 bg-gray-100 dark:bg-gray-700"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="relative">
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 dark:text-white">
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {divisions.map((division, index) => (
                    <tr key={division.id} className="dark:text-white">
                      <td className="whitespace-nowrap px-4 py-2">
                        {index + 1 + (currentPage - 1) * 5}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2">
                        {division.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2">
                        {new Date(division.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2">
                        <div className="flex gap-2">
                          <Link
                            to={`${division.id}/edit`}
                            className="bg-yellow-500 text-white py-1 px-3 rounded"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteDivision(division.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {divisions.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        No divisions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {lastPage > 1 && (
            <div className="flex justify-center mt-4">
              <nav>
                <ul className="inline-flex -space-x-px">
                  {Array.from({ length: lastPage }, (_, i) => (
                    <li key={i}>
                      <button
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 border ${currentPage === i + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700'
                          } border-gray-300`}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Index;