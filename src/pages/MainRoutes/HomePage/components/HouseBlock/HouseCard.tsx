import { useNavigate } from "react-router-dom";

interface CardProps {
  house: any;
}

function HouseCard({ house }: CardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/House/${house.id}`);
  };

  return (
    <div className="space-y-2 w-48 cursor-pointer" onClick={handleClick}>
      <div className="size-44 bg-gray-400 rounded-2xl overflow-hidden">
        <img
          src={house.thumbnail}
          alt="thumbnail"
          draggable="false"
          className="size-full object-cover select-none"
        />
      </div>
      <div className="select-none px-2 py-0.5 space-y-0.5">
        <h6 className="line-clamp-1 font-semibold">{house.title}</h6>
        <p className="text-sm line-clamp-1">{house.location.address}</p>
      </div>
    </div>
  );
}

export default HouseCard;
