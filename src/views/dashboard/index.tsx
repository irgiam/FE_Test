import React, { useEffect, useState } from "react";
import { LocalApi } from "../../services/api";
import * as echarts from "echarts";
import { DatePicker } from "../../components/DatePicker";

// Define interfaces for our data types
interface BankTraffic {
  bank: string;
  jumlah: number;
}

interface GateTraffic {
  gerbang: string;
  jumlah: number;
}

interface TrafficData {
  name: string;
  value: number;
}

interface DashboardData {
  tanggal: string;
  bankTraffic: BankTraffic[];
  gateTraffic: GateTraffic[];
  shiftTraffic: TrafficData[];
  ruasTraffic: TrafficData[];
}

interface ApiResponse {
  data: {
    data: DashboardData;
    meta: {
      code: number;
      message: string;
      status: string;
    };
  };
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [filterDate, setFilterDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await LocalApi.get<ApiResponse>("/dummyDashboard.json");
      setDashboardData(response.data?.data?.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterDate]); // Refetch when date changes

  useEffect(() => {
    if (dashboardData && !loading) {
      // Initialize charts after data is loaded
      initBankChart();
      initGateChart();
      initShiftChart();
      initRuasChart();
    }
  }, [dashboardData, loading]);

  const initBankChart = () => {
    const chartDom = document.getElementById("bank-chart");
    if (!chartDom || !dashboardData) return;

    const chart = echarts.init(chartDom);
    const option = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dashboardData.bankTraffic.map((item) => item.bank),
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        name: "Jumlah Lalu",
        nameLocation: "start",
        min: 0,
        max: 100,
      },
      series: [
        {
          data: dashboardData.bankTraffic.map((item) => item.jumlah),
          type: "bar",
          itemStyle: {
            color: "#475569", // slate-600
          },
        },
      ],
    };

    chart.setOption(option);

    // Handle resize
    window.addEventListener("resize", () => {
      chart.resize();
    });

    return () => {
      chart.dispose();
      window.removeEventListener("resize", () => {
        chart.resize();
      });
    };
  };

  const initGateChart = () => {
    const chartDom = document.getElementById("gate-chart");
    if (!chartDom || !dashboardData) return;

    const chart = echarts.init(chartDom);
    const option = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dashboardData.gateTraffic.map((item) => item.gerbang),
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        name: "Jumlah Lalu",
        nameLocation: "start",
        min: 0,
        max: 100,
      },
      series: [
        {
          data: dashboardData.gateTraffic.map((item) => item.jumlah),
          type: "bar",
          itemStyle: {
            color: "#475569", // slate-600
          },
        },
      ],
    };

    chart.setOption(option);

    // Handle resize
    window.addEventListener("resize", () => {
      chart.resize();
    });

    return () => {
      chart.dispose();
      window.removeEventListener("resize", () => {
        chart.resize();
      });
    };
  };

  const initShiftChart = () => {
    const chartDom = document.getElementById("shift-chart");
    if (!chartDom || !dashboardData) return;

    const chart = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Total Lalin",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: dashboardData.shiftTraffic.map((item) => ({
            value: item.value,
            name: item.name,
          })),
          color: ["#E2E8F0", "#94A3B8", "#334155"], // slate-200, slate-400, slate-700
        },
      ],
    };

    chart.setOption(option);

    // Handle resize
    window.addEventListener("resize", () => {
      chart.resize();
    });

    return () => {
      chart.dispose();
      window.removeEventListener("resize", () => {
        chart.resize();
      });
    };
  };

  const initRuasChart = () => {
    const chartDom = document.getElementById("ruas-chart");
    if (!chartDom || !dashboardData) return;

    const chart = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Total Lalin",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: dashboardData.ruasTraffic.map((item) => ({
            value: item.value,
            name: item.name,
          })),
          color: ["#E2E8F0", "#94A3B8", "#334155"], // slate-200, slate-400, slate-700
        },
      ],
    };

    chart.setOption(option);

    // Handle resize
    window.addEventListener("resize", () => {
      chart.resize();
    });

    return () => {
      chart.dispose();
      window.removeEventListener("resize", () => {
        chart.resize();
      });
    };
  };

  // Helper function to format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative">
          <input
            type="date"
            className="border border-gray-300 rounded px-4 py-2 w-48"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="Tanggal"
          />
        </div>
        <button
          className="!bg-blue-500 text-white px-6 py-2 rounded"
          onClick={fetchData}
        >
          Filter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Traffic Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <div id="bank-chart" className="h-64 w-full"></div>
          </div>

          {/* Shift Traffic Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center h-64">
              <div id="shift-chart" className="h-64 w-1/2"></div>
              <div className="w-1/2 pl-4">
                <h3 className="text-lg font-medium mb-4">Total Lalin</h3>
                {dashboardData?.shiftTraffic.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gate Traffic Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <div id="gate-chart" className="h-64 w-full"></div>
          </div>

          {/* Ruas Traffic Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center h-64">
              <div id="ruas-chart" className="h-64 w-1/2"></div>
              <div className="w-1/2 pl-4">
                <h3 className="text-lg font-medium mb-4">Total Lalin</h3>
                {dashboardData?.ruasTraffic.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
