import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SendMail = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Accept</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Send for Approval</DialogTitle>
          <DialogDescription>
            Share the documentation with the concerned person for final review.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Recipient Email</label>
            <Input type="email" placeholder="name@company.com" />
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Comment (optional)</label>
            <Textarea
              placeholder="Add a message or instructions..."
              className="min-h-[90px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendMail;
