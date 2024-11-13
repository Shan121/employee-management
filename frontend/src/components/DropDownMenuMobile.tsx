import { LOG_OUT } from "@/graphql/mutations/employee.mutation";
import { GET_AUTHENTICATED_EMPLOYEE } from "@/graphql/queries/employee.query";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface MenuItem {
  label: string;
  children?: MenuItem[];
}

const DropDownMenuMobile = ({ items }: { items: MenuItem[] }) => {
  const { data } = useQuery(GET_AUTHENTICATED_EMPLOYEE, {
    nextFetchPolicy: "cache-first",
  });

  const [logout, { loading, client }] = useMutation(LOG_OUT, {
    refetchQueries: ["GET_AUTHENTICATED_EMPLOYEE"],
  });

  const handleLogout = async () => {
    try {
      await logout();
      client.resetStore();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    }
  };
  //
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderItems = (menuItems: MenuItem[], level = 0) => {
    return menuItems.map((item, index) => {
      const key = `${level}-${index}`;
      const hasChildren = item.children && item.children.length > 0;

      return (
        <li key={key} className="relative">
          <button
            onClick={() => hasChildren && toggleMenu(key)}
            className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 ${
              hasChildren ? "font-semibold" : ""
            }`}
          >
            {item.label}
            {hasChildren && (
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  openMenus[key] ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
          {hasChildren && openMenus[key] && (
            <ul className="pl-4 mt-2 space-y-2 bg-white rounded-md shadow-lg">
              {item.children && renderItems(item.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className="relative inline-block text-left w-full">
      <ul className="mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div className="flex justify-between w-full mb-2">
          <Link
            to="/profile"
            className="px-2 py-2 hover:underline hover:text-blue-600"
          >
            {data?.authenticatedEmployee?.name}
          </Link>
          <button
            onClick={handleLogout}
            className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
        {renderItems(items)}
      </ul>
    </div>
  );
};

export default DropDownMenuMobile;
