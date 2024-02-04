import { StarIcon } from "lucide-react";

type Props = {
  isActive: boolean;
  onClick(): void;
};

const RateBarbershop = ({ isActive, onClick }: Props) => {
  return (
    <button onClick={onClick}>
      <StarIcon
        className="text-primary"
        size={18}
        color={isActive ? "hsl(252 100% 69%)" : "gray"}
      />
    </button>
  );
};

export default RateBarbershop;
