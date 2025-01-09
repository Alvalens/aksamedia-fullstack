import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Employee } from '../../../types/Employee';
import axiosInstance from '../../utils/axios';
import { BASE_URL } from './Index';
import Loader from '../Loader';

interface Division {
  id: string;
  name: string;
}

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Omit<Employee, 'id'>>({
    image: '',
    name: '',
    phone: '',
    division: '',
    position: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Employee, 'id'>, string>>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/employees/${id}`);
      if (response.data.status === 'success') {
        const employeeData = response.data.data.employee;
        setEmployee({
          image: employeeData.image || '',
          name: employeeData.name || '',
          phone: employeeData.phone || '',
          division: employeeData.division_id || '',
          position: employeeData.position || '',
        });
        console.log(employeeData);
      } else {
        alert('Failed to fetch employee');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      alert('Failed to fetch employee');
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/divisions');
      if (response.data.status === 'success') {
        setDivisions(response.data.data.divisions);
      } else {
        alert('Failed to fetch divisions');
      }
    } catch (error) {
      alert('Failed to fetch divisions');
      console.error('Error fetching divisions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
    fetchDivisions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setErrors((prev) => ({
      ...prev,
      image: '',
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof Omit<Employee, 'id'>, string>> = {};

    if (!employee.name) newErrors.name = 'Name is required.';
    else if (!/^[a-zA-Z ]+$/.test(employee.name)) newErrors.name = 'Name must be a string.';

    if (!employee.phone) newErrors.phone = 'Phone is required.';
    else if (!/^\d{8,12}$/.test(employee.phone)) newErrors.phone = 'Phone number must be 8-12 digits.';

    if (!employee.division) newErrors.division = 'Division is required.';

    if (!employee.position) newErrors.position = 'Position is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateEmployee = async () => {
    setUpdating(true);
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (imageFile) {
      formData.append('image', imageFile as Blob);
    }
    formData.append('name', employee.name);
    formData.append('phone', employee.phone);
    formData.append('division', employee.division);
    formData.append('position', employee.position);

    try {
      const response = await axiosInstance.post(`/employees/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        alert('Employee updated successfully!');
        navigate('/employees');
      } else {
        alert('Failed to update employee');
      }
    } catch (error: Error | any) {
      if (error.response) {
        if (error.response.status === 422) {
          const err = error.response.data.errors;
          if (err) {
            const newErrors: Partial<Record<keyof Omit<Employee, 'id'>, string>> = {};
            Object.keys(err).forEach((key) => {
              newErrors[key as keyof Omit<Employee, 'id'>] = err[key].join('. ');
            });
            setErrors(newErrors);
          }
          console.error('Error updating employee:', error);
        }
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      updateEmployee();
    }
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className='max-w-7xl mx-auto p-6 bg-white dark:bg-gray-600 dark:text-white shadow-sm rounded-md'>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-white">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            {employee.image && (
              <img
                src={`${BASE_URL}${employee.image}`}
                alt={employee.name}
                className="mt-2 w-24 h-24 rounded-full"
              />
            )}
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
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="division" className="block text-sm font-medium text-gray-700 dark:text-white">
              Division
            </label>
            <select
              id="division"
              name="division"
              value={employee.division}
              onChange={handleChange}
              className="mt-1 block dark:bg-gray-700 w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select a division</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
            {errors.division && <p className="text-red-500 text-sm">{errors.division}</p>}
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
            {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="bg-gray-500 text-white py-2 px-4 rounded"
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;