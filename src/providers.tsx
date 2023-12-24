import { TooltipProvider } from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

export default Providers;
