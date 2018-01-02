# maptest

This repo demonstrates how to use react-native-maps to display markers on the map based on the map's zoom level. The more zoomed in you are, the more markers are rendered.

To run on Android emulator:

react-native run-android

To run on iOS emulator:

react-native run-ios

To run on Android device:

1) connect your Android device to your computer
2) the phone should ask if you want to give the computer permissions - say 'Yes'.
   Note: if this message does not come up, or if there are errors, go to Settings
   -> Developer -> scroll down and hit 'revoke previous authorizations', then 
   disconnect and reconnect your phone
3) run 'adb devices' -> your phone should come up as authorized
4) run 'react-native run-android'

To run on iOS device:

1) connect your iOS device to your computer
2) the phone should ask if you want to give the computer permissions - say 'Yes'
3) in Xcode, select your selected device as the target device
4) hit run

