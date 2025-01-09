import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Employee } from '../../../types/Employee';

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      const employees: Employee[] = JSON.parse(storedEmployees);
      const employeeToEdit = employees.find((emp) => emp.id === id);
      if (employeeToEdit) {
        setEmployee(employeeToEdit);
      } else {
        setError('Employee not found.');
      }
    } else {
      setError('No employees found.');
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (employee) {
      setEmployee((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (employee) {

      if (!employee.name || !employee.phone || !employee.division || !employee.position) {
        setError('All fields are required.');
        return;
      }

      if (!/^\d{8,12}$/.test(employee.phone)) {
        setError('Phone number must be 8-12 digits.');
        return;
      }

      if (!/^[a-zA-Z ]+$/.test(employee.name)) {
        setError('Name must be string.');
        return;
      }

      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        const employees: Employee[] = JSON.parse(storedEmployees);
        const updatedEmployees = employees.map((emp) =>
          emp.id === employee.id ? employee : emp
        );
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      }

      console.log('Updated Employee:', employee);
      alert('Employee updated successfully!');
      navigate('/employees');
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!employee) {
    return <p>Loading...</p>;
  }

  return (
    <div className='max-w-7xl mx-auto p-6 bg-white dark:bg-gray-600 dark:text-white shadow-sm rounded-md'>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-white">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={employee.image}
              onChange={handleChange}
              className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={employee.name}
              onChange={handleChange}
              className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="division" className="block text-sm font-medium text-gray-700 dark:text-white">
              Division
            </label>
            <input
              type="text"
              id="division"
              name="division"
              value={employee.division}
              onChange={handleChange}
              className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-white">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={employee.position}
              onChange={handleChange}
              className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;