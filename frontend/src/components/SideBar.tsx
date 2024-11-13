import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import DropDownMenuMobile from "./DropDownMenuMobile";
import { menuItems } from "@/lib/menuItems";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>
              <Link to="/" className="px-4 py-2 cursor-pointer">
                LOGO
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="md:hidden">
            <DropDownMenuMobile items={menuItems} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SideBar;
