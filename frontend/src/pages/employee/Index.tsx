import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Employee } from '../../../types/Employee';

const Index: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryPage = parseInt(searchParams.get('page') || '1', 10);
  const querySearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [currentPage, setCurrentPage] = useState(queryPage);

  const employeesPerPage = 5;

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchTerm, currentPage, setSearchParams]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter((employee) => employee.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    console.log(`Employee with ID: ${id} deleted.`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-600 shadow-sm rounded-md">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Employee List</h1>
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
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee, index) => (
                <tr key={employee.id} className="dark:text-white">
                  <td className="whitespace-nowrap  px-4 py-2">{indexOfFirst + index + 1}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <img
                      src={employee.image}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="whitespace-nowrap  px-4 py-2">{employee.name}</td>
                  <td className="whitespace-nowrap  px-4 py-2">{employee.phone}</td>
                  <td className="whitespace-nowrap  px-4 py-2">{employee.division}</td>
                  <td className="whitespace-nowrap px-4 py-2">{employee.position}</td>
                  <td className="whitespace-nowrap  px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        to={`${employee.id}/edit`}
                        className="bg-yellow-500 text-white py-1 px-3 rounded"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteEmployee(employee.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="inline-flex -space-x-px">
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i}>
                  <button
                    onClick={() => paginate(i + 1)}
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
    </div>
  );
};

export default Index;