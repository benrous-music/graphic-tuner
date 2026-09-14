// import { useEffect, useState } from 'react';
// import { Pressable, Text } from 'react-native';
// import { AudioManager, AudioRecorder } from 'react-native-audio-api';

// // AudioManager.setAudioSessionOptions({
// //   iosCategory: 'record',
// //   iosMode: 'default',
// //   iosOptions: [],
// // });

// const audioRecorder = new AudioRecorder();
// const sampleRate = 16000;

// export default function Recorder() {
//   const [isRecording, setIsRecording] = useState(false);

//   useEffect(() => {
//     audioRecorder.onAudioReady(
//       {
//         sampleRate,
//         bufferLength: sampleRate * 0.1, // 0.1s of audio each batch
//         channelCount: 1,
//       },
//       ({ buffer, numFrames, when }) => {
//         // do something with the data, i.e. stream it
//       }
//     );

//     return () => {
//       audioRecorder.clearOnAudioReady();
//     };
//   }, []);

//   const onStart = async () => {
//     if (isRecording) {
//       return;
//     }

//     // Make sure the permissions are granted
//     const permissions = await AudioManager.requestRecordingPermissions();

//     if (permissions !== 'Granted') {
//       console.warn('Permissions are not granted');
//       return;
//     }

//     // Activate audio session
//     try {
//       await AudioManager.setAudioSessionActivity(true);
//     } catch (error) {
//       console.warn('Could not activate the audio session', error);
//       return;
//     }

//     const result = await audioRecorder.start();

//     if (result.status === 'error') {
//       console.warn(result.message);
//       return;
//     }

//     setIsRecording(true);
//   };

//   const onStop = async () => {
//     if (!isRecording) {
//       return;
//     }

//     await audioRecorder.stop();
//     setIsRecording(false);
//     await AudioManager.setAudioSessionActivity(false);
//   };

//   return (
//     <Pressable onPress={isRecording ? onStop : onStart}>
//       <Text>{isRecording ? 'Stop' : 'Record'}</Text>
//     </Pressable>
//   );
// };
