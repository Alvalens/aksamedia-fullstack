import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);
    if (editedUser) {
      try {
        if (!editedUser.name || !editedUser.username || !editedUser.email || !editedUser.phone) {
          setError('All fields are required');
          return;
        }

        const success = await updateUser(editedUser);
        if (success) {
          setIsEditing(false);
          alert('User profile updated successfully');
        } else {
          setError('Failed to update user profile');
        }
        setLoading(false);
      } catch (error: Error | any) {
        if (error.response) {
          if (error.response.status === 422) {
            const err = error.response.data.errors;
            const messages = Object.values(err).flat().join('. ');
            setError(messages);
          } else {
            setError('Something went wrong. Please try again later.');
          }
        } else {
          setError('Network error. Please try again later.');
        }
        setLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedUser) {
      setEditedUser({ ...editedUser, [name]: value });
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-6 bg-white dark:bg-gray-600 dark:text-white shadow-sm rounded-md'>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isEditing ? (
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedUser?.name || ''}
                onChange={handleChange}
                className="dark:bg-gray-800 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={editedUser?.username || ''}
                onChange={handleChange}
                className="dark:bg-gray-800 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser?.email || ''}
                onChange={handleChange}
                className="dark:bg-gray-800 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white font-bold mb-2" htmlFor="phone">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={editedUser?.phone || ''}
                onChange={handleChange}
                className="dark:bg-gray-800 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                {...(loading ? { disabled: true } : {})}
                onClick={handleSave}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <strong>Name:</strong> {user?.name}
            </div>
            <div className="mb-4">
              <strong>Username:</strong> {user?.username}
            </div>
            <div className="mb-4">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="mb-4">
              <strong>Phone:</strong> {user?.phone}
            </div>
            <button
              onClick={handleEdit}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Edit Profile
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white py-2 px-4 rounded ml-4"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;