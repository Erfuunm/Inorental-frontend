function PropertyCard({ item, setPropertyDetail }: { item: any; setPropertyDetail: any }) {
  return (
    <div
      onClick={() => setPropertyDetail({ isShow: true, propertyData: item, actionLoading: false, actionError: null })}
      className="w-full h-36 cursor-pointer hover:bg-gray-100 rounded-xl transition-all flex gap-2 flex-none p-2 md:px-4 md:py-2"
    >
      {/* Thumbnail */}
      <div className="w-28 md:w-36 flex-none h-full bg-gray-200 rounded-xl overflow-hidden">
        {item?.photos?.[0]?.image ? (
          <img
            src={item.photos[0].image}
            alt="Property Thumbnail"
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-gray-600">
            No image
          </div>
        )}
      </div>
      {/* Property info */}
      <div className="px-1.5 py-2 h-full flex flex-col justify-around">
        <h4 className="md:text-lg font-semibold">{item?.title || "Untitled Property"}</h4>
        <span className="text-sm text-gray-700 line-clamp-2 md:text-base font-medium">
          {item?.address_street}, {item?.address_city}, {item?.address_state}
        </span>
        <p className="text-sm text-gray-600">
          ${item?.price_per_night || "N/A"} / night
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;