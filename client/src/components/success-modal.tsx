import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, RefreshCw, Calendar } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessLink: string;
  channelName: string;
  isSubscription?: boolean;
  nextBillingDate?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  accessLink,
  channelName,
  isSubscription = true,
  nextBillingDate,
}: SuccessModalProps) {
  const handleOpenTelegram = () => {
    window.open(accessLink, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600 w-8 h-8" />
            </div>
          </div>
          <DialogTitle className="text-xl">Subscription Active!</DialogTitle>
          <DialogDescription>
            Your recurring subscription has been activated
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Your Channel Access</h4>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Badge variant="secondary" className="text-sm">
                {channelName}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                Auto-renew
              </Badge>
            </div>
            {nextBillingDate && (
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                Next billing: {new Date(nextBillingDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <Button
            onClick={handleOpenTelegram}
            className="w-full"
            size="lg"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Join Channel Now
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Keep this link safe - you can access your channel anytime:
            </p>
            <div className="bg-gray-50 rounded p-2 text-xs font-mono break-all">
              {accessLink}
            </div>
          </div>

          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
