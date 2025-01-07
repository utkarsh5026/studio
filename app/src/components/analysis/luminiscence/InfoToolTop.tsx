import { Info } from "lucide-react";

interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => (
  <div className="group relative inline-block ml-2">
    <Info className="w-4 h-4 text-gray-400" />
    <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg -right-2 top-6">
      {text}
    </div>
  </div>
);

export default InfoTooltip;
