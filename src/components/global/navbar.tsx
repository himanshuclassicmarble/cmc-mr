import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="text-2xl font-bold">cmc</div>
        <ModeToggle />
      </div>
    </header>
  );
}
