import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import RecentQuestions from "@/components/dashboard/RecentQuestions";
import TopTags from "@/components/dashboard/TopTags";
import TopUsers from "@/components/dashboard/TopUsers";
import ActivityChart from "@/components/dashboard/ActivityChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Dashboard</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<div>Loading metrics...</div>}>
          <DashboardMetrics />
        </Suspense>
      </section>

      <section className="mt-8">
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="background-light900_dark200 mb-6 min-h-[42px] p-1">
            <TabsTrigger value="activity" className="tab">
              Activity
            </TabsTrigger>
            <TabsTrigger value="questions" className="tab">
              Recent Questions
            </TabsTrigger>
            <TabsTrigger value="tags" className="tab">
              Top Tags
            </TabsTrigger>
            <TabsTrigger value="users" className="tab">
              Top Users
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="w-full">
            <div className="background-light900_dark200 light-border rounded-lg border p-6">
              <h3 className="h3-semibold text-dark200_light900 mb-6">Activity (Last 7 Days)</h3>
              <Suspense fallback={<div>Loading activity chart...</div>}>
                <ActivityChart />
              </Suspense>
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="w-full">
            <div className="background-light900_dark200 light-border rounded-lg border p-6">
              <h3 className="h3-semibold text-dark200_light900 mb-6">Recent Questions</h3>
              <Suspense fallback={<div>Loading recent questions...</div>}>
                <RecentQuestions />
              </Suspense>
            </div>
          </TabsContent>
          
          <TabsContent value="tags" className="w-full">
            <div className="background-light900_dark200 light-border rounded-lg border p-6">
              <h3 className="h3-semibold text-dark200_light900 mb-6">Top Tags</h3>
              <Suspense fallback={<div>Loading top tags...</div>}>
                <TopTags />
              </Suspense>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="w-full">
            <div className="background-light900_dark200 light-border rounded-lg border p-6">
              <h3 className="h3-semibold text-dark200_light900 mb-6">Top Contributors</h3>
              <Suspense fallback={<div>Loading top users...</div>}>
                <TopUsers />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default Dashboard;

