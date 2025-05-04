import React, { useCallback, useEffect, useState, useRef } from "react";
import useLogout from "../../services/useLogout";
import Cookies from "js-cookie";
import Api from "../../services/api";
import { Trash, Download, Search, Filter, RefreshCw } from "lucide-react";
import { PaginationState } from "../../types/types";

interface FilterState {
  search: string;
  date: string | null;
  type: string;
}

const LalinOverview = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false)
  // const [selectedDataId, setSelectedDataId] = useState<string | null>(null)
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalData: 0,
    pageSize: 10,
  });
  const [filterState, setFilterState] = useState<FilterState>({
    search: "",
    date: null,
    type: "all",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add a ref to track if component is mounted
  // Add a ref to prevent additional fetches when already in error state
  const hasError = useRef<boolean>(false);

  const logout = useLogout();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilter = () => {
    // Reset halaman saat melakukan filter baru
    fetchDataTable(1, paginationState.pageSize);
  };

  const handleResetFilter = () => {
    setFilterState({
      search: "",
      date: null,
      type: "all",
    });
    // Setelah reset filter, ambil data dengan filter kosong
    fetchDataTable(1, paginationState.pageSize);
  };

  const fetchDataTable = useCallback(
    async (page = 1, limit = 10) => {
      // Don't fetch if we've already encountered an error
      if (hasError.current) {
        return;
      }

      const token = Cookies.get("token");

      if (!token) {
        logout();
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Persiapkan parameter query dengan menghilangkan nilai null/undefined
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());

        if (filterState.search) {
          queryParams.append("search", filterState.search);
        }

        if (filterState.date) {
          queryParams.append("date", filterState.date);
        }

        if (filterState.type && filterState.type !== "all") {
          queryParams.append("type", filterState.type);
        }

        const response = await Api.get(`/lalins?${queryParams.toString()}`);
        const { data } = response.data;
        // console.log("Data:", data?.rows?.rows);

        setDataList(data?.rows?.rows || []);
        setPaginationState({
          currentPage: response?.data?.current_page,
          totalPages: response?.data?.total_pages,
          totalData: response?.data?.count,
          pageSize: limit,
        });
      } catch (error: any) {
        console.error("Error fetching data:", error);
        const errorMessage =
          error?.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data";
        setError(errorMessage);
        setDataList([]);

        // Set error flag to prevent continuous refetching
        hasError.current = true;

        if (error?.response?.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [filterState, logout]
  );

  const handlePageChange = (newPage: number) => {
    // Don't proceed if we already have an error
    if (hasError.current) {
      return;
    }

    if (newPage > 0 && newPage <= paginationState.totalPages) {
      // Perbarui halaman saat ini sebelum fetch data
      setPaginationState((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  // Effect untuk memanggil fetchDataTable saat paginationState.currentPage berubah
  useEffect(() => {
    // Reset the error flag when we're attempting to fetch data again
    hasError.current = false;
    fetchDataTable(paginationState.currentPage, paginationState.pageSize);
  }, [paginationState.currentPage, paginationState.pageSize]);

  // Add a function to retry after error
  const handleRetry = () => {
    // Reset error flag
    hasError.current = false;
    // Refetch data
    fetchDataTable(paginationState.currentPage, paginationState.pageSize);
  };

  return (
    <div className="max-w-[92rem] mx-auto">
      {/* Header dengan Tombol Add Product */}
      <div className="flex justify-between items-center mb-4">
        <h3>Laporan Lalin Per Hari</h3>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-grow max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cari laporan..."
              name="search"
              value={filterState.search}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="date"
            value={filterState.date || ""}
            onChange={handleFilterChange}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            disabled={isLoading}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>

          <button
            onClick={handleResetFilter}
            className="!bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center !bg-blue-600 text-white px-4 py-2 rounded-lg hover:!bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Export
        </button>
      </div>

      {/* Tabs untuk filter type */}
      <div className="flex gap-2 mb-4">
        {["all", "Tunai", "E-Toll", "Flo", "KTP"].map((typeOption) => (
          <button
            key={typeOption}
            onClick={() => {
              setFilterState((prev) => ({
                ...prev,
                type: typeOption,
              }));
              fetchDataTable(1, paginationState.pageSize);
            }}
            className={`px-4 py-2 rounded-full border ${
              filterState.type === typeOption
                ? "!bg-blue-600 text-white"
                : "!bg-white text-gray-600 border-gray-300"
            } hover:bg-blue-500 hover:text-white transition-colors`}
          >
            {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
          </button>
        ))}
      </div>

      {/* Error state with retry button */}
      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg flex justify-between items-center"
          role="alert"
        >
          <span>{error}</span>
          <button
            onClick={handleRetry}
            className="ml-4 px-3 py-1 !bg-red-700 text-white rounded-md hover:!bg-red-800 text-xs"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center p-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2">Memuat data...</p>
        </div>
      )}

      {/* Tabel dan Pagination */}
      {!isLoading && !error && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  Cabang
                </th>
                <th scope="col" className="px-6 py-3">
                  Gerbang
                </th>
                <th scope="col" className="px-6 py-3">
                  Gardu
                </th>
                <th scope="col" className="px-6 py-3">
                  Golongan
                </th>
                <th scope="col" className="px-6 py-3">
                  Asal Gerbang
                </th>
                <th scope="col" className="px-6 py-3">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 ? (
                dataList.map((data: any, index: number) => (
                  <tr
                    key={data.id || index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">{index + 1}</div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {data.IdCabang || "-"}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {data.IdGerbang || "-"}
                    </th>
                    <td className="px-6 py-4">
                      {/* {data.createdAt
                        ? moment(data.createdAt).format("DD MMM YYYY")
                        : "-"} */}
                      {data.IdGardu || "-"}
                    </td>
                    <td className="px-6 py-4">{data.Golongan || "-"}</td>
                    <td className="px-6 py-4">{data.IdAsalGerbang || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <Trash
                          // onClick={() => handleOpenDeleteModal(data.id)}
                          className="text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                          size={16}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {dataList.length > 0 && (
            <nav
              className="flex flex-col md:flex-row justify-between items-center pt-4"
              aria-label="Table navigation"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {dataList.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {paginationState.totalData}
                </span>{" "}
                data
              </span>
              <ul className="inline-flex -space-x-px text-sm">
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(paginationState.currentPage - 1)
                    }
                    disabled={paginationState.currentPage === 1}
                    className={`px-3 py-1 border rounded-l !bg-gray-100 hover:!bg-gray-200 ${
                      paginationState.currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Previous
                  </button>
                </li>
                {Array.from(
                  { length: 5 },
                  (_, i) => paginationState.currentPage - 2 + i
                )
                  .filter(
                    (page) => page > 0 && page <= paginationState.totalPages
                  )
                  .map((page) => (
                    <li key={page}>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border ${
                          page === paginationState.currentPage
                            ? "!bg-blue-500 text-white"
                            : "!bg-gray-100 hover:!bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(paginationState.currentPage + 1)
                    }
                    disabled={
                      paginationState.currentPage ===
                        paginationState.totalPages ||
                      paginationState.totalPages === 0
                    }
                    className={`px-3 py-1 border rounded-r !bg-gray-100 hover:!bg-gray-200 ${
                      paginationState.currentPage ===
                        paginationState.totalPages ||
                      paginationState.totalPages === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default LalinOverview;
