import { Card } from "@/components/ui/card";

import CreateLinkButton from "./components/create-link-button";

import { getCurrentProfile } from "@/lib/data/current-profile";
import { getLinkTable } from "@/lib/data/link-table";
import { LinkTableWrapper } from "./components/link-table-wrapper";

const LinkGenerator = async () => {
  const user = await getCurrentProfile();
  const links = await getLinkTable();

  const hasLinks = links.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Form Request & Review
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Generate secure vendor form links, review submissions, and forward
          them through the approval workflow.
        </p>
      </section>

      {/* Action Bar */}
      <section className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Active form requests and submissions
        </div>
        <CreateLinkButton user={user} />
      </section>

      {/* Main Content */}
      <Card className="w-full min-h-[50vh] p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">
            Requests & Submissions
          </h2>
        </div>

        {hasLinks ? (
          <LinkTableWrapper data={links} />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                No form requests created yet.
              </p>
              <CreateLinkButton user={user} />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LinkGenerator;
