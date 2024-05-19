import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { FlashList } from "@shopify/flash-list"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

const tasks = [
  { id: "1", task: "Buy her flowers" },
  { id: "2", task: "Plan a date" },
  { id: "3", task: "Compliment her" },
  // Add more tasks here
]

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"])
  const [taskList, setTaskList] = useState(tasks)

  return (
    <View style={$container}>
      <View style={[$topContainer, $topContainerInsets]}>
        <Text preset="subheading" tx="welcomeScreen.welcomeHeader" style={$welcomeHeader} />
        <Text preset="default" tx="welcomeScreen.todoToday" style={$todoToday} />
        <FlashList
          data={taskList}
          keyExtractor={(item) => item.id}
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
