import { menuItems } from "@/lib/menuItems";
import DropDownMenu from "./DropDownMenu";
import SideBar from "./SideBar";

const Header = () => {

  return (
    <div className="p-2">
      <div className="hidden md:block">
        <DropDownMenu items={menuItems} />
      </div>
      <div className="md:hidden">
        <SideBar />
      </div>
    </div>
  );
};

export default Header;
