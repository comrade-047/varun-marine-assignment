import { Loader2 } from "lucide-react";

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4 text-[#001E2B]/80">
      <Loader2 className="animate-spin text-[#00ED64]" size={42} strokeWidth={2.5} />
      <p className="text-sm font-medium text-[#001E2B]/70">{message}</p>
    </div>
  );
}
