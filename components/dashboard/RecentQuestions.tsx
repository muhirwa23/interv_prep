"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  username: string;
  picture: string;
}

interface Question {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  createdAt: string;
  views: number;
}

const RecentQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentQuestions = async () => {
      try {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        
        if (data.success) {
          setQuestions(data.data.recentQuestions);
        }
      } catch (error) {
        console.error("Error fetching recent questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentQuestions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, index) => (
          <QuestionSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-dark400_light800">No questions found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((question) => (
        <Link 
          href={`/questions/${question._id}`} 
          key={question._id}
          className="background-light800_dark300 light-border flex flex-col gap-3 rounded-lg border p-4 hover:shadow-md transition-all"
        >
          <h4 className="text-dark200_light900 line-clamp-1 font-semibold">{question.title}</h4>
          
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span 
                key={tag._id} 
                className="background-light700_dark400 text-dark400_light700 rounded-md px-2 py-1 text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Image 
                src={question.author.picture || "/icons/avatar.svg"} 
                alt={question.author.name}
                width={20}
                height={20}
                className="rounded-full"
              />
              <p className="text-dark400_light700 text-xs">{question.author.name}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Image src="/icons/eye.svg" alt="Views" width={16} height={16} />
                <p className="text-dark400_light700 text-xs">{question.views}</p>
              </div>
              
              <p className="text-dark400_light700 text-xs">
                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const QuestionSkeleton = () => {
  return (
    <div className="background-light800_dark300 light-border flex flex-col gap-3 rounded-lg border p-4">
      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      
      <div className="flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default RecentQuestions;

