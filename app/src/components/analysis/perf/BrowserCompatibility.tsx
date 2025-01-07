import type { BrowserCompatibilityAnalysis } from "../../../analysis/performance";
import { Alert, AlertDescription } from "../../ui/alert";
import { FaChrome, FaFirefox, FaSafari, FaEdge } from "react-icons/fa";
import { SiOpera } from "react-icons/si";
import PerfCard from "./PerfCard";

interface BrowserCompatibilityProps {
  metrics: BrowserCompatibilityAnalysis;
}

const BrowserCompatibility: React.FC<BrowserCompatibilityProps> = ({
  metrics,
}) => {
  const { compatibility, format, recommendation } = metrics;

  const browserIcons: { [key: string]: React.ReactNode } = {
    Chrome: <FaChrome className="w-5 h-5" />,
    Firefox: <FaFirefox className="w-5 h-5" />,
    Safari: <FaSafari className="w-5 h-5" />,
    Edge: <FaEdge className="w-5 h-5" />,
    Opera: <SiOpera className="w-5 h-5" />,
  };

  const getSupportClass = (support: string) => {
    switch (support) {
      case "Full":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
      case "Partial":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
      default:
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
    }
  };

  return (
    <PerfCard
      title="Browser Compatibility"
      description="Format support across major browsers"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {compatibility.map((browser) => (
            <div
              key={browser.browser}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {browserIcons[browser.browser]}
                  <span className="font-medium dark:text-gray-100">
                    {browser.browser}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${getSupportClass(
                    browser.support
                  )}`}
                >
                  {browser.support}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Alert>
          <AlertDescription className="dark:text-gray-100">
            Current Format: {format}
            <br />
            {recommendation}
          </AlertDescription>
        </Alert>
      </div>
    </PerfCard>
  );
};

export default BrowserCompatibility;
