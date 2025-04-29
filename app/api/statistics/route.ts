import { NextResponse } from "next/server";

import { Question, Answer, User, Tag } from "@/database";
import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/error";

export async function GET() {
  try {
    await dbConnect();

    // Get total counts
    const totalQuestions = await Question.countDocuments();
    const totalAnswers = await Answer.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalTags = await Tag.countDocuments();

    // Get recent questions
    const recentQuestions = await Question.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: "author", model: User, select: "name username picture" })
      .populate({ path: "tags", model: Tag, select: "name" });

    // Get top tags
    const topTags = await Tag.aggregate([
      {
        $lookup: {
          from: "tagquestions",
          localField: "_id",
          foreignField: "tag",
          as: "questions"
        }
      },
      {
        $project: {
          name: 1,
          questionCount: { $size: "$questions" }
        }
      },
      { $sort: { questionCount: -1 } },
      { $limit: 5 }
    ]);

    // Get top users
    const topUsers = await User.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "author",
          as: "questions"
        }
      },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "author",
          as: "answers"
        }
      },
      {
        $project: {
          name: 1,
          username: 1,
          picture: 1,
          reputation: 1,
          questionCount: { $size: "$questions" },
          answerCount: { $size: "$answers" },
          totalContributions: { $add: [{ $size: "$questions" }, { $size: "$answers" }] }
        }
      },
      { $sort: { totalContributions: -1 } },
      { $limit: 5 }
    ]);

    // Get activity over time (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const activityData = await Question.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          questions: totalQuestions,
          answers: totalAnswers,
          users: totalUsers,
          tags: totalTags
        },
        recentQuestions,
        topTags,
        topUsers,
        activityData
      }
    }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
}

