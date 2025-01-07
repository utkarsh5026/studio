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
      className="relative overflow-hidden rounded-xl
      shadow-md hover:shadow-xl transition-all duration-300 ease-in-out
      border border-gray-200/20 dark:border-gray-800/20 
      bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm
      dark:shadow-gray-900/30 dark:hover:shadow-gray-900/40
      hover:transform hover:scale-[1.02]
      group"
    >
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="dark:text-gray-400/90 text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
};

export default PerfCard;
