import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// import { Employee } from '../../../types/Employee';
import axiosInstance from '../../utils/axios';
import { Edit2, Trash2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  phone: string;
  division: {
    id: string;
    name: string;
  };
  position: string;
  image: string;
}

export const BASE_URL = 'http://localhost:8000/storage/';

const Index: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
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
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/employees', {
          params: { name: searchTerm, page: currentPage },
        });

        if (response.data.status === 'success') {
          setEmployees(response.data.data.employees);

          const { total, current_page, last_page } = response.data.pagination;
          setTotal(total);
          setCurrentPage(current_page);
          setLastPage(last_page);
        } else {
          alert('Failed to fetch employees');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        alert('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [searchTerm, currentPage]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await axiosInstance.delete(`/employees/${id}`);
        if (response.data.status === 'success') {
          alert('Employee deleted successfully');
          setEmployees((prev) => prev.filter((employee) => employee.id !== id));
        } else {
          alert('Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-600 shadow-sm rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Employee List ({total})</h1>
      </div>
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
            setCurrentPage(1); // Reset to page 1 when searching
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
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Division</th>
                    <th className="px-4 py-2 text-left">Position</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr key={employee.id} className="dark:text-white">
                      <td className="whitespace-nowrap px-4 py-2">
                        {index + 1 + (currentPage - 1) * 5}
                      </td>
                      <td className="whitespace-nowrap py-2 ">
                        <img
                          src={`${BASE_URL}${employee.image}` || 'https://via.placeholder.com/150'}
                          alt={employee.name}
                          className="w-12 h-12 rounded-full"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2">{employee.name}</td>
                      <td className="whitespace-nowrap px-4 py-2">{employee.phone}</td>
                      <td className="whitespace-nowrap px-4 py-2">{employee.division.name}</td>
                      <td className="whitespace-nowrap px-4 py-2">{employee.position}</td>
                      <td className="whitespace-nowrap px-4 py-2">
                        <Link
                          to={`${employee.id}/edit`}
                          className="bg-blue-500 text-white py-1 px-2 rounded inline-flex items-center"
                        >
                          <Edit2 className="w-5 p-1" />
                        </Link>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="bg-red-500 text-white py-1 px-2 rounded ml-2 inline-flex items-center"
                        >
                          <Trash2 className="w-5 p-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {lastPage > 1 && (
            <nav className="flex justify-center mt-4">
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
          )}
        </>
      )}
    </div>
  );
};

export default Index;
