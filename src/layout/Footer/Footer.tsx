export default function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-gray-700 px-4">
      {/* Top Section */}
      <div className="mx-auto px-6 py-10 border-b border-gray-400">
        <h2 className="text-lg font-semibold mb-4">
          Inspiration for future getaways
        </h2>
        <div className="flex flex-wrap gap-6 mb-6 text-sm font-medium text-gray-800">
          <span className="underline">Unique stays</span>
          <span>Categories</span>
          <span>Travel tips & inspiration</span>
          <span>InoRental-friendly apartments</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            ["Cabins", "United States"],
            ["Treehouses", "United States"],
            ["Glamping", "United States"],
            ["Tiny Houses", "United States"],
            ["Beach Houses", "United States"],
            ["Campers and RVs", "United States"],
            ["Lakehouses", "United States"],
            ["Yurt Rentals", "United Kingdom"],
            ["Yurt Rentals", "United States"],
            ["Castle Rentals", "United States"],
            ["Houseboats", "United States"],
            ["Holiday Caravans", "United Kingdom"],
            ["Private Island Rentals", "United States"],
            ["Farm Houses", "United States"],
            ["Farm Cottages", "United Kingdom"],
            ["Cabin Rentals", "Australia"],
            ["Luxury Cabins", "United Kingdom"],
          ].map(([type, location], idx) => (
            <div key={idx}>
              <p className="font-medium">{type}</p>
              <p className="text-gray-500">{location}</p>
            </div>
          ))}
          <p className="underline font-medium">Show more</p>
        </div>
      </div>

      {/* Bottom Columns */}
      <div className="mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-400">
        {[
          {
            title: "Support",
            items: [
              "Help Center",
              "AirCover",
              "Anti-discrimination",
              "Disability support",
              "Cancellation options",
              "Report neighborhood concern",
            ],
          },
          {
            title: "Hosting",
            items: [
              "InoRental your home",
              "AirCover for Hosts",
              "Hosting resources",
              "Community forum",
              "Hosting responsibly",
              "InoRental-friendly apartments",
              "Join a free Hosting class",
              "Find a co-host",
            ],
          },
          {
            title: "InoRental",
            items: [
              "2025 Summer Release",
              "Newsroom",
              "New features",
              "Careers",
              "Investors",
              "Gift cards",
              "InoRental.org emergency stays",
            ],
          },
        ].map((section, idx) => (
          <div key={idx} className="">
            <h3 className="font-semibold mb-2 text-lg">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Legal / Settings Row */}
      <div className="mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <div className="space-x-3 mb-3 md:mb-0">
          <span>© 2025 InoRental, Inc.</span>
          <span>· Terms</span>
          <span>· Sitemap</span>
          <span>· Privacy</span>
          <span>· Your Privacy Choices</span>
        </div>
        <div className="flex items-center gap-4">
          <span>🌐 English (US)</span>
          <span>$ USD</span>
          <span>⚫</span>
          <span>🕊️</span>
          <span>📱</span>
        </div>
      </div>
    </footer>
  );
}
