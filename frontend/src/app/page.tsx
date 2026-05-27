"use client";

import {
  IndianRupee,
  TrendingUp,
  Users,
  FileSpreadsheet,
  Rocket,
  Upload,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import DistributorTable from "@/components/dashboard/DistributorTable";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Welcome to Star Q Analytics - Sri Siri Publishers"
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Total Revenue"
          value="₹0"
          change="+0%"
          changeType="neutral"
          icon={IndianRupee}
          description="All time revenue"
        />
        <KPICard
          title="This Month"
          value="₹0"
          change="+0%"
          changeType="neutral"
          icon={TrendingUp}
          description="Current month revenue"
        />
        <KPICard
          title="Distributors"
          value="0"
          change="+0"
          changeType="neutral"
          icon={Users}
          description="Active distributors"
        />
        <KPICard
          title="Files Processed"
          value="0"
          change="+0"
          changeType="neutral"
          icon={FileSpreadsheet}
          description="Excel files uploaded"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <DistributorTable />
        </div>
      </div>

      {/* Getting Started Message */}
      <div className="bg-gradient-to-br from-primary-50 via-primary-50 to-accent-50 dark:from-primary-900/30 dark:via-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-800/50 rounded-2xl p-6 transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
              Getting Started
            </h3>
            <p className="text-primary-700 dark:text-primary-300 mb-4">
              Welcome to Star Q Analytics! Follow these steps to see your data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/40 rounded-xl">
                <span className="w-8 h-8 bg-primary-100 dark:bg-primary-800/50 rounded-lg flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                  1
                </span>
                <span className="text-sm text-primary-800 dark:text-primary-200 font-medium">
                  Go to Upload
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/40 rounded-xl">
                <span className="w-8 h-8 bg-primary-100 dark:bg-primary-800/50 rounded-lg flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                  2
                </span>
                <span className="text-sm text-primary-800 dark:text-primary-200 font-medium">
                  Upload Excel files
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/40 rounded-xl">
                <span className="w-8 h-8 bg-primary-100 dark:bg-primary-800/50 rounded-lg flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                  3
                </span>
                <span className="text-sm text-primary-800 dark:text-primary-200 font-medium">
                  Auto-process
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/40 rounded-xl">
                <span className="w-8 h-8 bg-primary-100 dark:bg-primary-800/50 rounded-lg flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                  4
                </span>
                <span className="text-sm text-primary-800 dark:text-primary-200 font-medium">
                  View insights
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
              >
                <Upload className="w-4 h-4" />
                Start Uploading
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-xl border border-primary-200 dark:border-primary-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
