"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Tag {
  _id: string;
  name: string;
  questionCount: number;
}

const TopTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTags = async () => {
      try {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        
        if (data.success) {
          setTags(data.data.topTags);
        }
      } catch (error) {
        console.error("Error fetching top tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTags();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, index) => (
          <TagSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-dark400_light800">No tags found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tags.map((tag) => (
        <Link 
          href={`/tags/${tag._id}`} 
          key={tag._id}
          className="background-light800_dark300 light-border flex items-center justify-between rounded-lg border p-4 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <Image 
              src="/icons/tag.svg" 
              alt={tag.name}
              width={20}
              height={20}
            />
            <div>
              <h4 className="text-dark200_light900 font-medium">{tag.name}</h4>
              <p className="text-dark400_light700 text-xs">{tag.questionCount} questions</p>
            </div>
          </div>
          
          <div className="background-light700_dark400 text-dark400_light700 rounded-md px-3 py-1 text-xs font-medium">
            #{tag.questionCount}
          </div>
        </Link>
      ))}
    </div>
  );
};

const TagSkeleton = () => {
  return (
    <div className="background-light800_dark300 light-border flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div>
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-32 mt-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      
      <div className="h-6 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
};

export default TopTags;

