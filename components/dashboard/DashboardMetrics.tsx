"use client";

import { useEffect, useState } from "react";
import Metric from "@/components/Metric";

interface MetricsData {
  questions: number;
  answers: number;
  users: number;
  tags: number;
}

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        
        if (data.success) {
          setMetrics(data.data.counts);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <>
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </>
    );
  }

  return (
    <>
      <Metric
        imgUrl="/icons/question.svg"
        alt="Questions"
        value={metrics?.questions || 0}
        title="Total Questions"
        textStyles="text-dark400_light800"
      />
      <Metric
        imgUrl="/icons/message.svg"
        alt="Answers"
        value={metrics?.answers || 0}
        title="Total Answers"
        textStyles="text-dark400_light800"
      />
      <Metric
        imgUrl="/icons/tag.svg"
        alt="Tags"
        value={metrics?.tags || 0}
        title="Total Tags"
        textStyles="text-dark400_light800"
      />
      <Metric
        imgUrl="/icons/users.svg"
        alt="Users"
        value={metrics?.users || 0}
        title="Total Users"
        textStyles="text-dark400_light800"
      />
    </>
  );
};

const MetricSkeleton = () => {
  return (
    <div className="background-light900_dark200 light-border flex flex-col items-center justify-center gap-4 rounded-md border p-6">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="h-7 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
};

export default DashboardMetrics;

