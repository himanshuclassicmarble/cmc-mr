import Navbar from "./navbar";
import { getCurrentProfile } from "@/lib/data/current-profile";

export default async function NavbarWrapper() {
  const user = await getCurrentProfile();

  if (!user) {
    return null;
  }

  return <Navbar user={user} />;
}
