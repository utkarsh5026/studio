import React from "react";

type StatsProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

const Stats: React.FC<StatsProps> = ({ icon, label, value }) => {
  return (
    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-gray-600 dark:text-gray-300">{icon}</div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>
      <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </span>
    </div>
  );
};

export default Stats;
