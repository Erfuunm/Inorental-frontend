import { LoaderIcon as Icon } from "react-hot-toast";

interface LoaderIconProps {
  className?: string;
  style?: React.CSSProperties;
}

function LoaderIcon({ style }: LoaderIconProps) {
  return <Icon style={{ width: "6rem", height: "6rem", ...style }} />;
}

export default LoaderIcon;
