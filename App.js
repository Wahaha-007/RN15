import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';

// 2. Setting for notification object behavior
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false, // Suppress the output
      shouldSetBadge: false, // Something like red dot on unread (unhandled) E-mail
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    // 3. (Real) Receiving the notification
    // subscription object is used later for cleaning up
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('NOTIFICATION RECEIVED');
        console.log(notification);
        const userName = notification.request.content.data.userName;
        console.log(userName);
      }
    );

    /* From console screen
    response = {
      actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
      notification: {
        date: 1653794379618,
        request: {
          content: [Object],
          identifier: 'e7bd9a23-0b46-4cd2-8c99-c4ecd3769529',
          trigger: [Object],
        },
      },
    }; */

    // 4. (Real) Receiving the response
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('NOTIFICATION REPONSE RECEIVED');
        console.log(response);
        const userName = response.notification.request.content.data.userName;
        console.log(userName);
      }
    );

    return () => {
      subscription2.remove(); // Not quite understand the code here
      subscription1.remove();
    };
  }, []);

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
