import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { MRRequest } from "../../types";

interface MRRequestApprovalProps {
  data: MRRequest;
}

interface FormValues {
  quantityReq: number;
  quantityApproved: number;
}

export const MRRequestApproval = ({ data }: MRRequestApprovalProps) => {
  const status = data.status;
  const statusColor =
    status === "approved"
      ? "bg-green-600 text-green-50 hover:bg-green-700"
      : status === "pending"
        ? "bg-yellow-600 text-yellow-50 hover:bg-yellow-700"
        : "bg-gray-500 text-gray-50 hover:bg-gray-600";

  const form = useForm<FormValues>({
    defaultValues: {
      quantityReq: undefined,
      quantityApproved: undefined,
    },
  });

  const handleApprove = (values: FormValues) => {
    console.log("Approved:", data, values);
  };

  const handleReject = () => {
    console.log("Rejected:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge
          className={`w-20 px-2 py-1 rounded-full text-xs font-medium uppercase cursor-pointer ${statusColor}`}
        >
          {status}
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Material Request Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleApprove)}
            className="space-y-4"
          >
            <div className="space-y-3 py-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">
                  Material Code:
                </span>
                <span className="col-span-2">{data.material}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">
                  Description:
                </span>
                <span className="col-span-2">{data.materialDescription}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Type:</span>
                <span className="col-span-2">{data.materialType}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">
                  Group:
                </span>
                <span className="col-span-2">{data.materialGroup}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">BUOM:</span>
                <span className="col-span-2">{data.buom}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">
                  Status:
                </span>
                <span className="col-span-2">{data.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="quantityReq"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity Required</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantityApproved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity Approved</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
              <Button type="submit" variant="default" className="w-full">
                Approve
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleReject}
                className="w-full"
              >
                Reject
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
