import  { useState } from "react";
import Sidebar from "../../../components/CoHostPanel/Sidebar"; // Reuse or create a CoHost-specific Sidebar
import { Home, User, Calendar } from "lucide-react";
import PropertyList from "./components/PropertyList";
import { useNavigate } from "react-router-dom";
import RentalManage from "../RentalsManage/RentalManage";

const CoHostPanel = () => {
  const [activeModal, setActiveModal] = useState<string | null>("properties-modal");

  const menuItems = [
    {
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      modalId: "dashboard-modal",
    },
    {
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      modalId: "profile-modal",
    },
    {
      label: "My Properties",
      icon: <Calendar className="w-5 h-5" />,
      modalId: "properties-modal",
    },
  ];

  const handleOpenModal = (modalId: string) => setActiveModal(modalId);
  const navigate = useNavigate();

  const renderModalContent = (modalId: string) => {
    const Box = ({ title, content }: { title: string; content: string }) => (
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p>{content}</p>
      </div>
    );

    switch (modalId) {
      case "dashboard-modal":
        return (
          <>
          <RentalManage />
          </>
        );
      case "profile-modal":
        return (
          <>
            <Box
              title="Personal Information"
              content="Update your personal details and preferences"
            />
            <Box
              title="Account Security"
              content="Manage your password and security settings"
            />
          </>
        );
      case "properties-modal":
        return <PropertyList />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row">
        <Sidebar menuItems={menuItems} onOpenModal={handleOpenModal} />
        <main className="flex-1 p-2 md:p-6 mt-2 md:mt-4 sm:mt-0">
          <div className="md:bg-white rounded-lg md:shadow-sm p-2 md:p-6 text-left">
            {activeModal ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">
                    {
                      menuItems.find((item) => item.modalId === activeModal)
                        ?.label
                    }
                  </h1>
                  <button
                    onClick={()=>navigate('/')}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    ← Back
                  </button>
                </div>
                <div className="space-y-4">
                  {renderModalContent(activeModal)}
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-6">
                  Welcome to Co-Host Panel
                </h1>
                <p>Select an option from the sidebar to manage your properties.</p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoHostPanel;