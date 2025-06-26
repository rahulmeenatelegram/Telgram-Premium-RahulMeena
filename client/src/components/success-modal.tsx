import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessLink: string;
  channelName: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  accessLink,
  channelName,
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
          <DialogTitle className="text-xl">Payment Successful!</DialogTitle>
          <DialogDescription>
            Your Telegram channel access has been activated
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Your Channel Access</h4>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                {channelName}
              </Badge>
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
