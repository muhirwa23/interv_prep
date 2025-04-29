import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocalSearch from "@/components/search/LocalSearch";
import SearchResults from "@/components/search/SearchResults";

interface SearchParams {
  searchParams: {
    q?: string;
    type?: string;
    page?: string;
    pageSize?: string;
  };
}

const SearchPage = ({ searchParams }: SearchParams) => {
  const { q, type = "all", page = "1", pageSize = "10" } = searchParams;

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Search Results</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col">
        <LocalSearch
          route="/search"
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="Search for questions, tags, or users"
          otherClasses="flex-1"
          initialValue={q}
        />
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <Tabs defaultValue={type} className="w-full">
          <TabsList className="background-light900_dark200 min-h-[42px] p-1">
            <TabsTrigger value="all" className="tab" asChild>
              <Link href={`/search?q=${q || ""}&type=all&page=1`}>All</Link>
            </TabsTrigger>
            <TabsTrigger value="questions" className="tab" asChild>
              <Link href={`/search?q=${q || ""}&type=questions&page=1`}>Questions</Link>
            </TabsTrigger>
            <TabsTrigger value="tags" className="tab" asChild>
              <Link href={`/search?q=${q || ""}&type=tags&page=1`}>Tags</Link>
            </TabsTrigger>
            <TabsTrigger value="users" className="tab" asChild>
              <Link href={`/search?q=${q || ""}&type=users&page=1`}>Users</Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={type} className="mt-5 w-full">
            <Suspense fallback={<div>Loading search results...</div>}>
              <SearchResults 
                query={q || ""} 
                type={type} 
                page={parseInt(page)} 
                pageSize={parseInt(pageSize)} 
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default SearchPage;

