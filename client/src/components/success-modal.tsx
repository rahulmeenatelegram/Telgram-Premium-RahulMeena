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
            Your 30-day access period has started
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Your Channel Access</h4>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Badge variant="secondary" className="text-sm">
                {channelName}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                30-day access
              </Badge>
            </div>
            <div className="flex items-center justify-center text-sm text-green-600">
              <Calendar className="w-4 h-4 mr-1" />
              Valid for 30 days from today
            </div>
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
              Your Telegram channel access link (valid for 30 days):
            </p>
            <div className="bg-gray-50 rounded p-3 text-sm font-mono break-all border-2 border-gray-200">
              <span className="text-blue-600 font-medium">{accessLink}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click "Join Channel Now" or use this link directly in Telegram
            </p>
          </div>

          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
