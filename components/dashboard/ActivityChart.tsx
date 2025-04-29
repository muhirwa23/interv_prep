"use client";

import { useEffect, useState, useRef } from "react";

interface ActivityData {
  _id: string; // date in YYYY-MM-DD format
  count: number;
}

const ActivityChart = () => {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        
        if (data.success) {
          setActivityData(data.data.activityData);
        }
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  useEffect(() => {
    if (activityData.length > 0 && chartRef.current) {
      renderChart();
    }
  }, [activityData]);

  const renderChart = () => {
    if (!chartRef.current) return;

    // Clear previous chart
    chartRef.current.innerHTML = "";

    // Find max value for scaling
    const maxCount = Math.max(...activityData.map(item => item.count), 1);
    
    // Create chart container
    const chartContainer = document.createElement("div");
    chartContainer.className = "flex items-end justify-between h-64 w-full gap-2";
    
    // Create bars for each day
    activityData.forEach(item => {
      const barHeight = (item.count / maxCount) * 100;
      const formattedDate = new Date(item._id).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      const barContainer = document.createElement("div");
      barContainer.className = "flex flex-col items-center gap-2";
      
      const bar = document.createElement("div");
      bar.className = "primary-gradient w-12 rounded-t-md transition-all duration-300 hover:opacity-80";
      bar.style.height = `${Math.max(barHeight, 5)}%`;
      
      const tooltip = document.createElement("div");
      tooltip.className = "absolute bottom-full mb-2 hidden rounded-md bg-dark-300 px-2 py-1 text-xs text-light-900 group-hover:block";
      tooltip.textContent = `${item.count} questions`;
      
      const barWrapper = document.createElement("div");
      barWrapper.className = "relative group flex h-full items-end";
      barWrapper.appendChild(bar);
      barWrapper.appendChild(tooltip);
      
      const label = document.createElement("span");
      label.className = "text-dark400_light700 text-xs";
      label.textContent = formattedDate;
      
      barContainer.appendChild(barWrapper);
      barContainer.appendChild(label);
      
      chartContainer.appendChild(barContainer);
    });
    
    chartRef.current.appendChild(chartContainer);
  };

  if (loading) {
    return (
      <div className="h-64 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    );
  }

  if (activityData.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <p className="text-dark400_light800">No activity data available</p>
      </div>
    );
  }

  return <div ref={chartRef} className="w-full" />;
};

export default ActivityChart;

