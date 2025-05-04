import { useEffect, useState, ReactNode, JSX, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  FileTextIcon,
  LogOutIcon,
  MenuIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapIcon,
} from "lucide-react";
import useLogout from "../services/useLogout";
import { ToastContainer } from "react-toastify";

// Props type
type DashboardLayoutProps = {
  children: ReactNode;
};

// Nav item type
type NavItem = {
  path?: string;
  label: string;
  icon: JSX.Element;
  key?: string;
  children?: NavItem[];
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const logout = useLogout();

  const navigationItems: NavItem[] = useMemo(
    () => [
      {
        path: "/",
        label: "Dashboard",
        icon: <HomeIcon className="w-5 h-5" />,
      },
      {
        label: "Laporan Lalin",
        key: "report",
        icon: <FileTextIcon className="w-5 h-5" />,
        children: [
          {
            path: "/lalin-perday-report",
            label: "Laporan Perhari",
            icon: <MapIcon className="w-5 h-5" />,
          },
        ],
      },
      {
        path: "/master-gerbang",
        label: "Master Gerbang",
        icon: <HomeIcon className="w-5 h-5" />,
      },
    ],
    []
  );

  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    navigationItems.forEach((item) => {
      if (item.children && item.key) {
        newOpenMenus[item.key] = item.children.some(
          (child) => child.path === location.pathname
        );
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname, navigationItems]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex h-screen w-screen bg-white-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h4
            className={`font-bold text-xl transition-all duration-300 ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          >
            Fe Test
          </h4>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          {navigationItems.map((item, index) => {
            if (item.children && item.key) {
              return (
                <div key={index}>
                  <button
                    onClick={() => toggleMenu(item.key!)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg mb-2 transition-colors ${
                      openMenus[item.key]
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {item.icon}
                      {isSidebarOpen && <span>{item.label}</span>}
                    </span>
                    {isSidebarOpen &&
                      (openMenus[item.key] ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      ))}
                  </button>
                  {openMenus[item.key] && (
                    <div className="pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path!}
                          className={`flex items-center space-x-2 p-2 rounded-lg mb-2 transition-colors ${
                            location.pathname === child.path
                              ? "bg-blue-100 text-blue-600"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {child.icon}
                          {isSidebarOpen && <span>{child.label}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path!}
                className={`flex items-center space-x-2 p-2 rounded-lg mb-2 transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {item.icon}
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="fixed top-0 right-0 z-30 w-full h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4">
            <div />
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          className="pt-16 h-screen"
          style={{ width: "calc(100% - 5rem)", background: "transparent" }}
        >
          <div className="p-4" style={{ background: "transparent" }}>
            {children}
          </div>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DashboardLayout;
