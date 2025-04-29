"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface User {
  _id: string;
  name: string;
  username: string;
  picture: string;
  reputation: number;
  questionCount: number;
  answerCount: number;
  totalContributions: number;
}

const TopUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        
        if (data.success) {
          setUsers(data.data.topUsers);
        }
      } catch (error) {
        console.error("Error fetching top users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, index) => (
          <UserSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-dark400_light800">No users found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <Link 
          href={`/profile/${user._id}`} 
          key={user._id}
          className="background-light800_dark300 light-border flex items-center justify-between rounded-lg border p-4 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <Image 
              src={user.picture || "/icons/avatar.svg"} 
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h4 className="text-dark200_light900 font-medium">{user.name}</h4>
              <p className="text-dark400_light700 text-xs">@{user.username}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="background-light700_dark400 text-dark400_light700 rounded-md px-3 py-1 text-xs font-medium">
              Reputation: {user.reputation}
            </div>
            <div className="flex gap-3 mt-2 text-xs text-dark400_light700">
              <span>{user.questionCount} questions</span>
              <span>{user.answerCount} answers</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const UserSkeleton = () => {
  return (
    <div className="background-light800_dark300 light-border flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div>
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-24 mt-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="h-6 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-3 mt-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default TopUsers;

