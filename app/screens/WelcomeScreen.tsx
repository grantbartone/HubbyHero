import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { FlashList } from "@shopify/flash-list"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"
import * as Notifications from "expo-notifications"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

const TRIGGER_DAILY: Notifications.DailyTriggerInput = { hour: 8, minute: 0, repeats: true }

// Implement this later
// const TRIGGER_WEEKLY: Notifications.WeeklyTriggerInput = {
//   hour: 18,
//   minute: 0,
//   weekday: 2, // Weekdays are specified with a number from 1 through 7, with 1 indicating Sunday
//   repeats: true,
// }

const tasks = [
  { id: 1, task: "Compliment her", trigger: TRIGGER_DAILY },
  { id: 2, task: "Make her coffee", trigger: TRIGGER_DAILY },
  // { id: 3, task: "Buy her flowers", trigger: TRIGGER_WEEKLY },
  // { id: 4, task: "Plan a date", trigger: TRIGGER_WEEKLY },
]

Notifications.setNotificationHandler({
  handleNotification: async () => {
    console.log("🚀 ~ handleNotification!")
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }
  },
})

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"])
  const [taskList] = useState(tasks)

  useEffect(() => {
    async function schedulePushNotification(
      id: number,
      trigger: Notifications.NotificationTriggerInput,
    ) {
      console.log("🚀 ~ schedulePushNotification!")
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hubby Hero to the rescue! 🦸‍♂️",
          body: "Review your tasks and make her feel special! 💖",
          data: { id },
        },
        trigger,
      })
    }

    async function getAllScheduledNotificationsAsync() {
      // Notifications.cancelAllScheduledNotificationsAsync()
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
      console.log("🚀 ~ ScheduledNotifications", JSON.stringify(scheduledNotifications))

      const resultIds = scheduledNotifications.map((r) => r.content.data.id)
      for (const task of tasks) {
        if (!resultIds.includes(task.id)) {
          schedulePushNotification(task.id, task.trigger)
        }
      }
    }

    getAllScheduledNotificationsAsync()
  }, [])

  return (
    <View style={$container}>
      <View style={[$topContainer, $topContainerInsets]}>
        <Text preset="subheading" tx="welcomeScreen.welcomeHeader" style={$welcomeHeader} />
        <Text preset="default" tx="welcomeScreen.todoToday" style={$todoToday} />
        <FlashList
          data={taskList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <View style={$taskItem}>
              <Text>{item.task}</Text>
              <Button
                tx="welcomeScreen.complete"
                onPress={() => {
                  /* Mark task as complete */
                }}
              />
            </View>
          )}
          estimatedItemSize={200}
        />
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  flexGrow: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flex: 1,
  flexGrow: 1,
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $welcomeHeader: ViewStyle = {
  marginBottom: spacing.md,
}

const $todoToday: ViewStyle = {
  marginBottom: spacing.xs,
}

const $taskItem: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: spacing.md,
}
