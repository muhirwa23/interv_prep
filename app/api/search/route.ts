import { NextResponse } from "next/server";

import { Question, Tag, User } from "@/database";
import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { z } from "zod";

const SearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  type: z.enum(["questions", "tags", "users", "all"]).default("all"),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";
    const type = url.searchParams.get("type") || "all";
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");

    const validatedData = SearchSchema.safeParse({
      query,
      type,
      page,
      pageSize,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { query: searchQuery, type: searchType, page: currentPage, pageSize: limit } = validatedData.data;
    const skipAmount = (currentPage - 1) * limit;

    await dbConnect();

    let results = {};
    const searchRegex = new RegExp(searchQuery, "i");

    if (searchType === "all" || searchType === "questions") {
      const questions = await Question.find({ 
        $or: [
          { title: { $regex: searchRegex } },
          { content: { $regex: searchRegex } }
        ] 
      })
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(limit)
      .sort({ createdAt: -1 });

      const totalQuestions = await Question.countDocuments({
        $or: [
          { title: { $regex: searchRegex } },
          { content: { $regex: searchRegex } }
        ]
      });

      if (searchType === "all") {
        results = {
          ...results,
          questions: {
            data: questions,
            totalCount: totalQuestions,
          }
        };
      } else {
        results = {
          data: questions,
          totalCount: totalQuestions,
        };
      }
    }

    if (searchType === "all" || searchType === "tags") {
      const tags = await Tag.find({ name: { $regex: searchRegex } })
        .skip(skipAmount)
        .limit(limit);

      const totalTags = await Tag.countDocuments({ name: { $regex: searchRegex } });

      if (searchType === "all") {
        results = {
          ...results,
          tags: {
            data: tags,
            totalCount: totalTags,
          }
        };
      } else {
        results = {
          data: tags,
          totalCount: totalTags,
        };
      }
    }

    if (searchType === "all" || searchType === "users") {
      const users = await User.find({
        $or: [
          { name: { $regex: searchRegex } },
          { username: { $regex: searchRegex } }
        ]
      })
        .skip(skipAmount)
        .limit(limit);

      const totalUsers = await User.countDocuments({
        $or: [
          { name: { $regex: searchRegex } },
          { username: { $regex: searchRegex } }
        ]
      });

      if (searchType === "all") {
        results = {
          ...results,
          users: {
            data: users,
            totalCount: totalUsers,
          }
        };
      } else {
        results = {
          data: users,
          totalCount: totalUsers,
        };
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: results,
      isNext: searchType === "all" 
        ? false 
        : (skipAmount + limit) < (results as any).totalCount
    }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
}

