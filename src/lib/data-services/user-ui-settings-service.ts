import prisma from "../prisma"
import type { UserUiSetting } from "@prisma/client"

// Get settings for user
export const getSettingsForUser = async (userId: string): Promise<UserUiSetting | null> => {
  try {
    console.log(`[user-ui-settings-service] getSettingsForUser called with userId: ${userId}`)
    return await prisma.userUiSetting.findUnique({
      where: { userId },
    })
  } catch (error) {
    console.error(`Error fetching UI settings for user ${userId}:`, error)
    return null
  }
}

// Update user settings
export const updateUserSettings = async (
  userId: string,
  data: {
    fontSize?: string
    colorTheme?: string
    layoutMode?: string
    additionalSettings?: any
  },
): Promise<UserUiSetting | null> => {
  try {
    console.log(
      `[user-ui-settings-service] updateUserSettings called with userId: ${userId}, data: ${JSON.stringify(data)}`,
    )
    return await prisma.userUiSetting.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    })
  } catch (error) {
    console.error(`Error updating UI settings for user ${userId}:`, error)
    return null
  }
}
