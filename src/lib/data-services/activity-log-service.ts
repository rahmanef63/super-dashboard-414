import prisma from "../prisma"
import type { ActivityLog } from "@prisma/client"

// Log activity
export const logActivity = async (data: {
  userId: string
  action: string
  metadata?: any
}): Promise<ActivityLog | null> => {
  try {
    console.log(`[activity-log-service] logActivity called with data: ${JSON.stringify(data)}`)
    return await prisma.activityLog.create({
      data,
    })
  } catch (error) {
    console.error("Error logging activity:", error)
    return null
  }
}

// Get activity logs for user
export const getActivityLogsForUser = async (userId: string, limit = 50, offset = 0): Promise<ActivityLog[]> => {
  try {
    console.log(
      `[activity-log-service] getActivityLogsForUser called with userId: ${userId}, limit: ${limit}, offset: ${offset}`,
    )
    return await prisma.activityLog.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })
  } catch (error) {
    console.error(`Error fetching activity logs for user ${userId}:`, error)
    return []
  }
}

// Get recent activity logs
export const getRecentActivityLogs = async (limit = 50): Promise<ActivityLog[]> => {
  try {
    console.log(`[activity-log-service] getRecentActivityLogs called with limit: ${limit}`)
    return await prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })
  } catch (error) {
    console.error("Error fetching recent activity logs:", error)
    return []
  }
}
