import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaMapMarkerAlt, FaBed, FaBath, FaUsers, FaDollarSign, FaInfoCircle, FaCamera } from 'react-icons/fa';
import { useApi } from '../../../contexts/ApiProvider';
import toast from 'react-hot-toast';

interface Photo {
  image: File | null;
  description: string | null;
}

const RentalManage: React.FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [formData, setFormData] = useState({
    host: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
    },
    title: '',
    description: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip_code: '',
    address_country: '',
    latitude: '',
    longitude: '',
    property_type: '',
    room_category: '',
    price_per_night: '',
    max_guests: 0,
    num_bedrooms: 0,
    num_beds: 0,
    num_bathrooms: '',
  });
  const [photos, setPhotos] = useState<Photo[]>([{ image: null, description: null }]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('host.')) {
      const hostField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        host: { ...prev.host, [hostField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handlePhotoChange = (index: number, file: File | null) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index] = { ...newPhotos[index], image: file };
      return newPhotos;
    });
  };

  const handlePhotoDescriptionChange = (index: number, value: string) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index] = { ...newPhotos[index], description: value || null };
      return newPhotos;
    });
  };

  const addPhotoField = () => {
    setPhotos((prev) => [...prev, { image: null, description: null }]);
  };

  const removePhotoField = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      debugger
      // Prepare form data for submission
      const formDataToSend = new FormData();
      formDataToSend.append('host[username]', formData.host.username);
      formDataToSend.append('host[first_name]', formData.host.first_name);
      formDataToSend.append('host[last_name]', formData.host.last_name);
      formDataToSend.append('host[email]', formData.host.email);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('address_street', formData.address_street);
      formDataToSend.append('address_city', formData.address_city);
      formDataToSend.append('address_state', formData.address_state);
      formDataToSend.append('address_zip_code', formData.address_zip_code);
      formDataToSend.append('address_country', formData.address_country);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('property_type', formData.property_type);
      formDataToSend.append('room_category', formData.room_category);
      formDataToSend.append('price_per_night', formData.price_per_night);
      formDataToSend.append('max_guests', formData.max_guests.toString());
      formDataToSend.append('num_bedrooms', formData.num_bedrooms.toString());
      formDataToSend.append('num_beds', formData.num_beds.toString());
      formDataToSend.append('num_bathrooms', formData.num_bathrooms);

      // Append photos
      photos.forEach((photo, index) => {
        if (photo.image) {
          formDataToSend.append(`photos[${index}][image]`, photo.image);
          if (photo.description) {
            formDataToSend.append(`photos[${index}][description]`, photo.description);
          }
        }
      });

      const res = await api.post('/api/properties/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 401) {
        toast.error('Please First Login');
        navigate('/');
      }

      if (res.ok) {
        toast.success('Your Rental created Successfully');
        navigate('/');
      } else {
        if (res.body?.latitude) {
          toast.error('Enter Valid Number for latitude');
        }
        if (res.body?.longitude) {
          toast.error('Enter Valid Number for longitude');
        }
        setError('Failed to create rental. Please check your inputs.');
      }
    } catch (err) {
      setError('Failed to create rental. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-1">
      <div className="w-[95%] mt-[5%] mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaHome className="mr-2 text-orange-600" /> Create a New Rental
        </h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Host Information */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-orange-600" /> Host Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Username</label>
                <input
                  type="text"
                  name="host.username"
                  value={formData.host.username}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  name="host.email"
                  value={formData.host.email}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">First Name</label>
                <input
                  type="text"
                  name="host.first_name"
                  value={formData.host.first_name}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Last Name</label>
                <input
                  type="text"
                  name="host.last_name"
                  value={formData.host.last_name}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaHome className="mr-2 text-orange-600" /> Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter property title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Property Type</label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  rows={4}
                  placeholder="Describe your property"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-orange-600" /> Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Street</label>
                <input
                  type="text"
                  name="address_street"
                  value={formData.address_street}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">City</label>
                <input
                  type="text"
                  name="address_city"
                  value={formData.address_city}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">State</label>
                <input
                  type="text"
                  name="address_state"
                  value={formData.address_state}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter state"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Zip Code</label>
                <input
                  type="text"
                  name="address_zip_code"
                  value={formData.address_zip_code}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter zip code"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Country</label>
                <input
                  type="text"
                  name="address_country"
                  value={formData.address_country}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter country"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter latitude"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter longitude"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaCamera className="mr-2 text-orange-600" /> Photos
            </h2>
            {photos.map((photo, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Upload Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(index, e.target.files?.[0] || null)}
                      className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Photo Description (Optional)</label>
                    <input
                      type="text"
                      value={photo.description || ''}
                      onChange={(e) => handlePhotoDescriptionChange(index, e.target.value)}
                      className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                      placeholder="Enter photo description"
                    />
                  </div>
                </div>
                {photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhotoField(index)}
                    className="mt-2 text-red-500 hover:text-red-600"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPhotoField}
              className="mt-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
            >
              Add Another Photo
            </button>
          </div>

          {/* Amenities */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaBed className="mr-2 text-orange-600" /> Amenities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Max Guests</label>
                <input
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleNumberChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter max guests"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Bedrooms</label>
                <input
                  type="number"
                  name="num_bedrooms"
                  value={formData.num_bedrooms}
                  onChange={handleNumberChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter number of bedrooms"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Beds</label>
                <input
                  type="number"
                  name="num_beds"
                  value={formData.num_beds}
                  onChange={handleNumberChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter number of beds"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Bathrooms</label>
                <input
                  type="text"
                  name="num_bathrooms"
                  value={formData.num_bathrooms}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  placeholder="Enter number of bathrooms (e.g., 1.5)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Room Category</label>
                <select
                  name="room_category"
                  value={formData.room_category}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Entire home">Entire home</option>
                  <option value="Private room">Private room</option>
                  <option value="Shared room">Shared room</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Price per Night</label>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="price_per_night"
                    value={formData.price_per_night}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 pl-10 border rounded-lg focus:ring-orange-600 focus:border-orange-600"
                    placeholder="Enter price per night"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-600 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Rental'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalManage;