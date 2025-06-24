import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import toast from "react-hot-toast";
import { useApi } from "../../../../contexts/ApiProvider";
import PropertyListLoading from "./PropertyListLoading";
import { FaUser } from "react-icons/fa";
import { CgClose } from "react-icons/cg";

function PropertyList() {
  const [state, setState] = useState<{
    loading: boolean;
    propertyList: any[];
    error: string | null;
  }>({
    loading: false,
    propertyList: [],
    error: null,
  });

  const [propertyDetail, setPropertyDetail] = useState<{
    isShow: boolean;
    propertyData: any;
    actionLoading: boolean;
    actionError: string | null;
    isEditing: boolean; // New state for edit mode
    formData: any; // New state for form data
  }>({
    propertyData: {},
    isShow: false,
    actionLoading: false,
    actionError: null,
    isEditing: false,
    formData: {},
  });

  const { loading, propertyList, error } = state;
  const { isShow, propertyData, actionLoading, actionError, isEditing, formData } = propertyDetail;
  const api = useApi();

  useEffect(() => {
    const fetchPropertiesData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await api.get("/api/host-properties/");

        if (response?.ok && Array.isArray(response.body)) {
          setState({ propertyList: response.body, loading: false, error: null });
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        const errorMessage = "Failed to fetch properties. Please try again later.";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        toast.error(errorMessage);
      }
    };

    fetchPropertiesData();
  }, [api]);

  const handleDeleteProperty = async () => {
    if (!propertyData?.property_id) return;
    try {
      setPropertyDetail((prev) => ({ ...prev, actionLoading: true, actionError: null }));
      const response = await api.delete(`/api/host-properties/${propertyData.property_id}/`);
      if (response?.ok) {
        setState((prev) => ({
          ...prev,
          propertyList: prev.propertyList.filter(
            (item) => item.property_id !== propertyData.property_id
          ),
        }));
        setPropertyDetail({
          isShow: false,
          propertyData: {},
          actionLoading: false,
          actionError: null,
          isEditing: false,
          formData: {},
        });
        toast.success("Property deleted successfully!");
      } else {
        throw new Error("Failed to delete property");
      }
    } catch (error) {
      const errorMessage = "Failed to delete property. Please try again.";
      setPropertyDetail((prev) => ({
        ...prev,
        actionLoading: false,
        actionError: errorMessage,
      }));
      toast.error(errorMessage);
    }
  };

  const handleEditProperty = () => {
    // Initialize form data with current property data
    setPropertyDetail((prev) => ({
      ...prev,
      isEditing: true,
      formData: {
        host: { ...propertyData.host },
        title: propertyData.title || "",
        description: propertyData.description || "",
        address_street: propertyData.address_street || "",
        address_city: propertyData.address_city || "",
        address_state: propertyData.address_state || "",
        address_zip_code: propertyData.address_zip_code || "",
        address_country: propertyData.address_country || "",
        latitude: propertyData.latitude || "",
        longitude: propertyData.longitude || "",
        property_type: propertyData.property_type || "",
        room_category: propertyData.room_category || "",
        price_per_night: propertyData.price_per_night || "",
        max_guests: propertyData.max_guests || 0,
        num_bedrooms: propertyData.num_bedrooms || 0,
        num_beds: propertyData.num_beds || 0,
        num_bathrooms: propertyData.num_bathrooms || "",
      },
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPropertyDetail((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyDetail((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        host: {
          ...prev.formData.host,
          [name]: value,
        },
      },
    }));
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyData?.property_id) return;
    try {
      setPropertyDetail((prev) => ({ ...prev, actionLoading: true, actionError: null }));
      const response = await api.patch(`/api/host-properties/${propertyData.property_id}/`, formData);
      if (response?.ok) {
        setState((prev) => ({
          ...prev,
          propertyList: prev.propertyList.map((item) =>
            item.property_id === propertyData.property_id ? { ...item, ...formData } : item
          ),
        }));
        setPropertyDetail((prev) => ({
          ...prev,
          propertyData: { ...prev.propertyData, ...formData },
          isEditing: false,
          actionLoading: false,
          actionError: null,
        }));
        toast.success("Property updated successfully!");
      } else {
        throw new Error("Failed to update property");
      }
    } catch (error) {
      const errorMessage = "Failed to update property. Please try again.";
      setPropertyDetail((prev) => ({
        ...prev,
        actionLoading: false,
        actionError: errorMessage,
      }));
      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setPropertyDetail((prev) => ({
      ...prev,
      isEditing: false,
      formData: {},
    }));
  };

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>{error}</p>
        <button

          className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen md:h-[34rem] flex flex-col overflow-auto gap-4 p-2 md:px-4 md:py-2">
      {/* Property list screen */}
      {loading ? (
        <PropertyListLoading />
      ) : propertyList.length === 0 ? (
        <div className="p-4 text-gray-600">
          <p>No properties found.</p>
        </div>
      ) : (
        propertyList.map((item) => (
          <PropertyCard
            key={item.property_id}
            item={item}
            setPropertyDetail={setPropertyDetail}
          />
        ))
      )}

      {/* Property info modal */}
      <div
        className={`${
          isShow ? "visible opacity-100" : "invisible opacity-0"
        } fixed inset-0 overflow-auto flex items-center justify-center transition-all z-50`}
      >
        <div
          onClick={() =>
            setPropertyDetail({
              isShow: false,
              propertyData: {},
              actionLoading: false,
              actionError: null,
              isEditing: false,
              formData: {},
            })
          }
          className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
        ></div>

        <div className="md:w-[40rem] flex-none md:h-[38rem] max-h-[90vh] size-full p-4 md:p-6 bg-white md:rounded-2xl flex flex-col relative shadow-lg">
          {/* Close button */}
          <button
            onClick={() =>
              setPropertyDetail({
                isShow: false,
                propertyData: {},
                actionLoading: false,
                actionError: null,
                isEditing: false,
                formData: {},
              })
            }
            className="p-2 bg-gray-200 cursor-pointer text-[#ff385c] text-2xl rounded-full absolute top-4 right-4 hover:bg-gray-300 transition"
            aria-label="Close modal"
          >
            <CgClose />
          </button>

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmitEdit} className="w-full flex-1 overflow-y-auto space-y-4">
              <h4 className="text-2xl font-bold text-gray-800">Edit Property</h4>
              <div className="space-y-2">
                <h5 className="text-lg font-semibold text-gray-700">Property Details</h5>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleFormChange}
                  placeholder="Property Title"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleFormChange}
                  placeholder="Description"
                  className="w-full p-2 border rounded-lg"
                  rows={4}
                />
                <input
                  type="text"
                  name="address_street"
                  value={formData.address_street || ""}
                  onChange={handleFormChange}
                  placeholder="Street Address"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="address_city"
                  value={formData.address_city || ""}
                  onChange={handleFormChange}
                  placeholder="City"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="address_state"
                  value={formData.address_state || ""}
                  onChange={handleFormChange}
                  placeholder="State"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="address_zip_code"
                  value={formData.address_zip_code || ""}
                  onChange={handleFormChange}
                  placeholder="Zip Code"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="address_country"
                  value={formData.address_country || ""}
                  onChange={handleFormChange}
                  placeholder="Country"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude || ""}
                  onChange={handleFormChange}
                  placeholder="Latitude"
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude || ""}
                  onChange={handleFormChange}
                  placeholder="Longitude"
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  name="property_type"
                  value={formData.property_type || ""}
                  onChange={handleFormChange}
                  placeholder="Property Type"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="room_category"
                  value={formData.room_category || ""}
                  onChange={handleFormChange}
                  placeholder="Room Category"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="price_per_night"
                  value={formData.price_per_night || ""}
                  onChange={handleFormChange}
                  placeholder="Price per Night"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  name="max_guests"
                  value={formData.max_guests || 0}
                  onChange={handleFormChange}
                  placeholder="Max Guests"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  name="num_bedrooms"
                  value={formData.num_bedrooms || 0}
                  onChange={handleFormChange}
                  placeholder="Number of Bedrooms"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  name="num_beds"
                  value={formData.num_beds || 0}
                  onChange={handleFormChange}
                  placeholder="Number of Beds"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="num_bathrooms"
                  value={formData.num_bathrooms || ""}
                  onChange={handleFormChange}
                  placeholder="Number of Bathrooms"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <h5 className="text-lg font-semibold text-gray-700">Host Information</h5>
                <input
                  type="text"
                  name="username"
                  value={formData.host?.username || ""}
                  onChange={handleHostChange}
                  placeholder="Username"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="first_name"
                  value={formData.host?.first_name || ""}
                  onChange={handleHostChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.host?.last_name || ""}
                  onChange={handleHostChange}
                  placeholder="Last Name"
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.host?.email || ""}
                  onChange={handleHostChange}
                  placeholder="Email"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition ${
                    actionLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition ${
                    actionLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  Cancel
                </button>
              </div>
              {actionError && (
                <p className="text-sm text-red-600 mt-2">{actionError}</p>
              )}
            </form>
          ) : (
            <>
              {/* Thumbnail */}
              <div className="w-full h-80 bg-gray-200 overflow-hidden rounded-2xl mb-4">
                {propertyData?.photos?.[0]?.image ? (
                  <img
                    src={propertyData.photos[0].image}
                    alt="Property thumbnail"
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center text-gray-600">
                    No image available
                  </div>
                )}
              </div>
              {/* Property details */}
              <div className="w-full flex-1 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">
                    {propertyData?.title || "Untitled Property"}
                  </h4>
                </div>
                <div className="space-y-2">
                  <h5 className="text-lg font-semibold text-gray-700">Property Details</h5>
                  <p className="text-sm text-gray-600">
                    Type: {propertyData?.property_type || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {propertyData?.room_category || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Max Guests: {propertyData?.max_guests || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Bedrooms: {propertyData?.num_bedrooms || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Beds: {propertyData?.num_beds || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Bathrooms: {propertyData?.num_bathrooms || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price per Night: ${propertyData?.price_per_night || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Address: {propertyData?.address_street}, {propertyData?.address_city}, {propertyData?.address_state} {propertyData?.address_zip_code}, {propertyData?.address_country}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    Description: {propertyData?.description || "No description available."}
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-lg font-semibold text-gray-700">Host Information</h5>
                  <div className="flex items-center space-x-4">
                    <div className="size-16 flex-none flex items-center justify-center rounded-full bg-gray-200 overflow-hidden">
                      {propertyData?.host?.profile_picture_url ? (
                        <img
                          src={propertyData.host.profile_picture_url}
                          alt="Host Profile Pic"
                          className="size-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-4xl text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {propertyData?.host?.first_name} {propertyData?.host?.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{propertyData?.host?.email}</p>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleEditProperty}
                    disabled={actionLoading}
                    className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition ${
                      actionLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {actionLoading ? "Processing..." : "Edit Property"}
                  </button>
                  <button
                    onClick={handleDeleteProperty}
                    disabled={actionLoading}
                    className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition ${
                      actionLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {actionLoading ? "Processing..." : "Delete Property"}
                  </button>
                </div>
                {actionError && (
                  <p className="text-sm text-red-600 mt-2">{actionError}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyList;