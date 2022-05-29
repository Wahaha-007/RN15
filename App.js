import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Platform, Alert } from 'react-native';
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
  // 5. Register Push Token to prepare to send push notification
  useEffect(() => {
    async function configurePushNotifications() {
      // 5.1 Request for user permisssion
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission required',
          'Push notifications need the appropriate permissions.'
        );
        return;
      }

      // 5.2 Get Token
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData);

      if (Platform.OS === 'android') {
        // Extra configuration only for Android
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }

    configurePushNotifications();
  }, []);

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

  // 6. Sending the Push Notification to expo endpoint (as specified in Doc)
  // https://docs.expo.dev/push-notifications/sending-notifications/#http2-api
  function sendPushNotificationHandler() {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'ExponentPushToken[H4RuzPIz9eAfbIgtu7WdKC]',
        title: 'Test - sent from a device!',
        body: 'This is a test!',
      }),
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />
      <Button
        title="Send Push Notification"
        onPress={sendPushNotificationHandler}
      />
      <StatusBar style="light" />
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
