import { useEffect, useState } from "react";
import ReserveCard from "./ReserveCard";
import toast from "react-hot-toast";
import { useApi } from "../../../../../contexts/ApiProvider";
import ReserveListLoading from "./ReserveListLoading";
import { FaUser } from "react-icons/fa";
import { CgClose } from "react-icons/cg";

function ReservationsList() {
  const [state, setState] = useState<{
    loading: boolean;
    bookingList: any[];
    error: string | null;
  }>({
    loading: false,
    bookingList: [],
    error: null,
  });

  const [bookingDetail, setBookingDetail] = useState<{
    isShow: boolean;
    propertyData: any;
    actionLoading: boolean;
    actionError: string | null;
  }>({
    propertyData: {},
    isShow: false,
    actionLoading: false,
    actionError: null,
  });

  const { loading, bookingList, error } = state;
  const { isShow, propertyData, actionLoading, actionError } = bookingDetail;
  const api = useApi();

  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await api.get("/api/bookings/");
        debugger
        if (response?.ok && Array.isArray(response.body.results)) {
          setState({ bookingList: response.body.results, loading: false, error: null });
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        const errorMessage = "Failed to fetch bookings. Please try again later.";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        toast.error(errorMessage);
      }
    };

    fetchBookingsData();
  }, [api]);

  const handleCancelBooking = async () => {
    if (!propertyData?.booking_id) return;
    try {
      setBookingDetail((prev) => ({ ...prev, actionLoading: true, actionError: null }));
      const response = await api.post(`/api/bookings/${propertyData.booking_id}/cancel`);
      if (response?.ok) {
        setState((prev) => ({
          ...prev,
          bookingList: prev.bookingList.map((item) =>
            item.booking_id === propertyData.booking_id ? { ...item, status: "Cancelled" } : item
          ),
        }));
        setBookingDetail((prev) => ({
          ...prev,
          propertyData: { ...prev.propertyData, status: "Cancelled" },
          actionLoading: false,
          actionError: null,
        }));
        toast.success("Booking cancelled successfully!");
      } else {
        throw new Error("Failed to cancel booking");
      }
    } catch (error) {
      const errorMessage = "Failed to cancel booking. Please try again.";
      setBookingDetail((prev) => ({
        ...prev,
        actionLoading: false,
        actionError: errorMessage,
      }));
      toast.error(errorMessage);
    }
  };

  const handlePayNow = async () => {
    if (!propertyData?.booking_id) return;
    try {
      setBookingDetail((prev) => ({ ...prev, actionLoading: true, actionError: null }));
      debugger
      const response = await api.get(`/api/bookings/${propertyData.booking_id}/payment/`);
      if (response?.ok) {

        setBookingDetail((prev) => ({
          ...prev,
          actionLoading: false,
          actionError: null,
        }));
        toast.success("Redirecting to payment...");
        // Redirect to payment URL or update UI as needed
       window.location.href = response.body.url
      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (error) {
      const errorMessage = "Failed to initiate payment. Please try again.";
      setBookingDetail((prev) => ({
        ...prev,
        actionLoading: false,
        actionError: errorMessage,
      }));
      toast.error(errorMessage);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => fetchBookingsData()}
          className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen md:h-[34rem] flex flex-col overflow-auto gap-4 p-2 md:px-4 md:py-2">
      {/* Booking list screen */}
      {loading ? (
        <ReserveListLoading />
      ) : bookingList.length === 0 ? (
        <div className="p-4 text-gray-600">
          <p>No reservations found.</p>
        </div>
      ) : (
        bookingList.map((item) => (
          <ReserveCard
            key={item.booking_id}
            item={item}
            setBookingDetail={setBookingDetail}
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
          onClick={() => setBookingDetail({ isShow: false, propertyData: {}, actionLoading: false, actionError: null })}
          className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
        ></div>

        <div className="md:w-[40rem] flex-none md:h-[38rem] max-h-[90vh] size-full p-4 md:p-6 bg-white md:rounded-2xl flex flex-col relative shadow-lg">
          {/* Close button */}
          <button
            onClick={() => setBookingDetail({ isShow: false, propertyData: {}, actionLoading: false, actionError: null })}
            className="p-2 bg-gray-200 cursor-pointer text-[#ff385c] text-2xl rounded-full absolute top-4 right-4 hover:bg-gray-300 transition"
            aria-label="Close modal"
          >
            <CgClose />
          </button>
          {/* Thumbnail */}
          <div className="w-full h-80 bg-gray-200 overflow-hidden rounded-2xl mb-4">
            {propertyData?.property?.photos?.[0]?.image ? (
              <img
                src={propertyData.property.photos[0].image}
                alt="Property thumbnail"
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full flex items-center justify-center text-gray-600">
                No image available
              </div>
            )}
          </div>
          {/* Booking details */}
          <div className="w-full flex-1 overflow-y-auto space-y-6">
            <div>
              <p className="uppercase text-sm font-semibold text-gray-500">
                Status: {propertyData?.status || "N/A"}
              </p>
              <h4 className="text-2xl font-bold text-gray-800">
                {propertyData?.property?.title || "Untitled Property"}
              </h4>
            </div>

            <div className="space-y-2">
              <h5 className="text-lg font-semibold text-gray-700">Booking Details</h5>
              <p className="text-sm text-gray-600">
                Check-in: {propertyData?.check_in_date || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Check-out: {propertyData?.check_out_date || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Guests: {propertyData?.num_guests || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Total Price: ${propertyData?.total_price || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Price per Night: ${propertyData?.property?.price_per_night || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Booked on: {new Date(propertyData?.created_at).toLocaleDateString() || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-lg font-semibold text-gray-700">Property Details</h5>
              <p className="text-sm text-gray-600">
                Type: {propertyData?.property?.property_type || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Category: {propertyData?.property?.room_category || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Max Guests: {propertyData?.property?.max_guests || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Address: {propertyData?.property?.address_street}, {propertyData?.property?.address_city}, {propertyData?.property?.address_state} {propertyData?.property?.address_zip_code}, {propertyData?.property?.address_country}
              </p>
              <p className="text-sm text-gray-600 line-clamp-3">
                Description: {propertyData?.property?.description || "No description available."}
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-lg font-semibold text-gray-700">Guest Information</h5>
              <div className="flex items-center space-x-4">
                <div className="size-16 flex-none flex items-center justify-center rounded-full bg-gray-200 overflow-hidden">
                  {propertyData?.guest?.profile_picture_url ? (
                    <img
                      src={propertyData.guest.profile_picture_url}
                      alt="Guest Profile Pic"
                      className="size-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-4xl text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {propertyData?.guest?.first_name} {propertyData?.guest?.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{propertyData?.guest?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-lg font-semibold text-gray-700">Host Information</h5>
              <div className="flex items-center space-x-4">
                <div className="size-16 flex-none flex items-center justify-center rounded-full bg-gray-200 overflow-hidden">
                  {propertyData?.property?.host?.profile_picture_url ? (
                    <img
                      src={propertyData.property.host.profile_picture_url}
                      alt="Host Profile Pic"
                      className="size-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-4xl text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {propertyData?.property?.host?.first_name || "Unknown Host"}
                  </p>
                  <p className="text-sm text-gray-600">{propertyData?.property?.host?.email}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {propertyData?.status === "Pending" && (
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleCancelBooking}
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition ${
                    actionLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionLoading ? "Processing..." : "Cancel Rental"}
                </button>
                <button
                  onClick={handlePayNow}
                  disabled={actionLoading || propertyData?.payment_session}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition ${
                    actionLoading || propertyData?.payment_session
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {actionLoading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            )}
            {actionError && (
              <p className="text-sm text-red-600 mt-2">{actionError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationsList;