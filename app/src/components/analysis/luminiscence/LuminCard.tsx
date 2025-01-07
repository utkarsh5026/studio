import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/card";
import InfoTooltip from "./InfoToolTop";

interface LuminCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  tooltip: string;
}

const LuminCard = ({
  title,
  description,
  children,
  tooltip,
}: LuminCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <InfoTooltip text={tooltip} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default LuminCard;
