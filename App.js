import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';

// 2. Receiving and dealing the notification
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false, // Suppress the output
      shouldSetBadge: true, // Something like red dot on unread (unhandled) E-mail
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  function scheduleNotificationHandler() {
    // 1. Sending the notification out
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'My first local notification',
        body: 'This is the body of the notification',
        data: { userName: 'Max' },
      },
      trigger: {
        seconds: 8,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1B5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
