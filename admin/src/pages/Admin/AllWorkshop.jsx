import React, { useState, useEffect, useContext } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';

const DeleteWorkshop = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState(null);
  const { backendUrl, aToken } = useContext(AdminContext);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/admin/get-all-workshops`, {
        headers: { aToken },
      });
      setWorkshops(response.data.workshops || []);
    } catch (error) {
      toast.error('Failed to fetch workshops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, [backendUrl, aToken]);

  const handleDelete = async () => {
    if (!workshopToDelete) return;
    try {
      await axios.delete(`${backendUrl}/api/admin/remove-workshop/${workshopToDelete}`, {
        headers: { aToken },
      });
      toast.success('Workshop deleted successfully');
      fetchWorkshops();
    } catch (error) {
      toast.error('Failed to delete workshop');
    } finally {
      setShowModal(false);
      setWorkshopToDelete(null);
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Loading workshops...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 w-full overflow-x-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">All Workshops</h2>
      {workshops.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No workshops available.</div>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Capacity</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workshops.map((workshop) => (
              <tr key={workshop._id} className="border-t border-gray-300">
                <td className="px-4 py-2">{new Date(workshop.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{workshop.title}</td>
                <td className="px-4 py-2">{workshop.location}</td>
                <td className="px-4 py-2">{workshop.capacity}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      setWorkshopToDelete(workshop._id);
                      setShowModal(true);
                    }}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-11/12 md:w-96">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="my-4">Are you sure you want to delete this workshop?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteWorkshop;