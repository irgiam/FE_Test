import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  Trash,
  Download,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Eye,
} from "lucide-react";
import Cookies from "js-cookie";
import Api from "../../services/api";
import useLogout from "../../services/useLogout";

// Import modal components
import FormModal from "./components/FormModal";
import ViewDetailModal from "./components/ViewDetailModal";
import DeleteModal from "./components/DeleteModal";

// Define types
interface Gerbang {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: Gerbang[];
    };
  };
}

const MasterGerbang: React.FC = () => {
  const [listData, setListData] = useState<Gerbang[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedGerbang, setSelectedGerbang] = useState<Gerbang | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const logout = useLogout();

  const fetchData = async () => {
    setIsLoading(true);
    const token = Cookies.get("token");

    if (!token) {
      logout();
      return;
    }
    try {
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await Api.get<ApiResponse>("/gerbangs");
      setListData(response.data?.data?.rows?.rows || []);
      setTotalPages(response.data?.data?.total_pages || 1);
      setTotalEntries(response.data?.data?.rows?.count || 0);
      console.log("Dashboard data:", response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, entriesPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredData = listData.filter((item) =>
    item.NamaGerbang.toLowerCase().includes(search?.toLowerCase() || "")
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedGerbang(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (gerbang: Gerbang) => {
    setIsEditMode(true);
    setSelectedGerbang(gerbang);
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (gerbang: Gerbang) => {
    setSelectedGerbang(gerbang);
    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (gerbang: Gerbang) => {
    setSelectedGerbang(gerbang);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: Partial<Gerbang>) => {
    try {
      if (isEditMode && selectedGerbang) {
        // Update existing gerbang
        await Api.put(`/gerbangs/${selectedGerbang.id}`, formData);
      } else {
        // Create new gerbang
        await Api.post("/gerbangs", formData);
      }
      fetchData();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} gerbang:`,
        error
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedGerbang) return;

    try {
      await Api.delete(`/gerbangs/${selectedGerbang.id}`);
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting gerbang:", error);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 ${
            currentPage === i
              ? "!bg-blue-500 text-white"
              : "!bg-white text-blue-500"
          } border border-gray-300 mx-1 rounded`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={5}>Show: 5 entries</option>
            <option value={10}>Show: 10 entries</option>
            <option value={25}>Show: 25 entries</option>
            <option value={50}>Show: 50 entries</option>
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 !bg-white text-blue-500 border border-gray-300 rounded mr-1 disabled:opacity-50"
          >
            &lt;
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 !bg-white text-blue-500 border border-gray-300 rounded ml-1 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Master Data Gerbang</h3>

      <div className="flex justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="space-x-2 flex">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 !bg-blue-500 text-white rounded-md hover:!bg-blue-600 flex items-center"
          >
            <PlusIcon size={18} className="mr-2" />
            Tambah
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Cabang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Gerbang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={`${item.id}-${item.IdCabang}`}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.NamaCabang}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.NamaGerbang}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenViewModal(item)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {renderPagination()}

      {/* Form Modal for Create/Edit */}
      <FormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedGerbang}
        isEdit={isEditMode}
      />

      {/* View Modal */}
      <ViewDetailModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        gerbang={selectedGerbang}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        gerbang={selectedGerbang}
      />
    </div>
  );
};

export default MasterGerbang;
