/**
 * A card component that displays data in a card format.
 * @param title - The title of the card.
 * @param children - The content to be displayed inside the card.
 */

import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

interface DataCardProps {
  title: string;
  children: React.ReactNode;
}

const DataCard = ({ title, children }: DataCardProps) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative overflow-hidden">{children}</CardContent>
    </Card>
  );
};

export default DataCard;
