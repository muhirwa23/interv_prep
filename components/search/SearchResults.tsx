"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  query: string;
  type: string;
  page: number;
  pageSize: number;
}

const SearchResults = ({ query, type, page, pageSize }: SearchResultsProps) => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(query)}&type=${type}&page=${page}&pageSize=${pageSize}`
        );
        
        const data = await response.json();
        
        if (data.success) {
          setResults(data.data);
        } else {
          setError(data.error || "Failed to fetch search results");
        }
      } catch (err) {
        setError("An error occurred while fetching search results");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, type, page, pageSize]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className="background-light800_dark300 light-border flex h-48 w-full animate-pulse rounded-lg border"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <Image
          src="/images/light-error.png"
          alt="Error"
          width={180}
          height={180}
          className="hidden dark:block"
        />
        <Image
          src="/images/dark-error.png"
          alt="Error"
          width={180}
          height={180}
          className="block dark:hidden"
        />
        <p className="text-dark400_light700 body-regular">{error}</p>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          onClick={() => router.push("/")}
        >
          Go Home
        </Button>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p className="text-dark400_light700 body-regular">Enter a search query to find results</p>
      </div>
    );
  }

  if (!results || (type === "all" && Object.keys(results).every(key => results[key].data.length === 0))) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <Image
          src="/images/light-illustration.png"
          alt="No results"
          width={180}
          height={180}
          className="hidden dark:block"
        />
        <Image
          src="/images/dark-illustration.png"
          alt="No results"
          width={180}
          height={180}
          className="block dark:hidden"
        />
        <p className="text-dark400_light700 body-regular">No results found for "{query}"</p>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          onClick={() => router.push("/")}
        >
          Go Home
        </Button>
      </div>
    );
  }

  // Determine if there's a next page
  const isNext = type === "all" ? false : results.totalCount > page * pageSize;

  return (
    <div className="flex flex-col gap-6">
      {type === "all" ? (
        // All results
        <>
          {results.questions && results.questions.data.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="h3-bold text-dark200_light900">Questions</h3>
                <Link 
                  href={`/search?q=${query}&type=questions&page=1`}
                  className="text-primary-500 hover:underline"
                >
                  View All
                </Link>
              </div>
              
              {results.questions.data.slice(0, 3).map((question: any) => (
                <QuestionCard key={question._id} question={question} />
              ))}
            </div>
          )}
          
          {results.tags && results.tags.data.length > 0 && (
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex items-center justify-between">
                <h3 className="h3-bold text-dark200_light900">Tags</h3>
                <Link 
                  href={`/search?q=${query}&type=tags&page=1`}
                  className="text-primary-500 hover:underline"
                >
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {results.tags.data.slice(0, 6).map((tag: any) => (
                  <TagCard key={tag._id} tag={tag} />
                ))}
              </div>
            </div>
          )}
          
          {results.users && results.users.data.length > 0 && (
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex items-center justify-between">
                <h3 className="h3-bold text-dark200_light900">Users</h3>
                <Link 
                  href={`/search?q=${query}&type=users&page=1`}
                  className="text-primary-500 hover:underline"
                >
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {results.users.data.slice(0, 6).map((user: any) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        // Specific type results
        <>
          {type === "questions" && results.data.map((question: any) => (
            <QuestionCard key={question._id} question={question} />
          ))}
          
          {type === "tags" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {results.data.map((tag: any) => (
                <TagCard key={tag._id} tag={tag} />
              ))}
            </div>
          )}
          
          {type === "users" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {results.data.map((user: any) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
          
          <Pagination 
            page={page.toString()} 
            isNext={isNext} 
          />
        </>
      )}
    </div>
  );
};

export default SearchResults;

