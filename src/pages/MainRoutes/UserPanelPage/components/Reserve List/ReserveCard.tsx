function ReserveCard({ item, setBookingDetail }: { item: any; setBookingDetail: any }) {
  return (
    <div
      onClick={() => setBookingDetail({ propertyData: item, isShow: true })}
      className="w-full h-36 cursor-pointer hover:bg-gray-100 rounded-xl transition-all flex gap-2 flex-none p-2 md:px-4 md:py-2"
    >
      {/* Thumbnail */}
      <div className="w-28 md:w-36 flex-none h-full bg-gray-200 rounded-xl overflow-hidden">
        {item?.property?.photos?.[0]?.image ? (
          <img
            src={item.property.photos[0].image}
            alt="Property Thumbnail"
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-gray-600">
            No image
          </div>
        )}
      </div>
      {/* Place info */}
      <div className="px-1.5 py-2 h-full flex flex-col justify-around">
        <p className="uppercase md:text-lg font-bold">{item?.status || "N/A"}</p>
        <h4 className="md:text-lg font-semibold">
          {item?.property?.title || "Untitled Property"}
        </h4>
        <span className="text-sm text-gray-700 line-clamp-2 md:text-base font-medium">
          Check-in: {item?.check_in_date || "N/A"} <br />
          Check-out: {item?.check_out_date || "N/A"}
        </span>
      </div>
    </div>
  );
}

export default ReserveCard;