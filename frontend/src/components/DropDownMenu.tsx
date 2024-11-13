import { useState } from "react";
import { LOG_OUT } from "@/graphql/mutations/employee.mutation";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_EMPLOYEE } from "@/graphql/queries/employee.query";

const DropDownMenu = ({ items }: { items: any[] }) => {
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
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderItems = (menuItems: any[], level = 0) => {
    return menuItems.map((item, index) => {
      const key = `${level}-${index}`;
      const hasChildren = item.children && item.children.length > 0;

      return (
        <li key={key} className="relative w-64">
          <button
            onClick={() => hasChildren && toggleMenu(key)}
            className={`flex items-center px-4 py-2 w-[inherit] text-left hover:bg-gray-100 ${
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
            <ul className="p-2 mt-2 space-y-2 bg-white rounded-md shadow-md">
              {renderItems(item.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className="relative inline-block text-left w-full">
      <ul className="relative flex gap-x-4 mt-2 w-full rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5">
        {renderItems(items)}
        <div className="flex gap-x-4 absolute end-0">
          <span className="px-4 py-2">{data?.authenticatedEmployee?.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </ul>
    </div>
  );
};

export default DropDownMenu;
