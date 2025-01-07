import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/card";

interface PerfCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const PerfCard: React.FC<PerfCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Card
      className="shadow-lg hover:shadow-xl transition-all duration-300 
      border border-gray-200/20 dark:border-gray-800/20 
      bg-white dark:bg-gray-900 
      dark:shadow-gray-900/30 dark:hover:shadow-gray-900/40"
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="dark:text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default PerfCard;
