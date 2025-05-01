
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { GestureEstimator, GestureDescription, Finger, FingerCurl, FingerDirection } from 'fingerpose';

// Initialize TensorFlow.js
tf.setBackend('webgl');

let handposeModel: handpose.HandPose | null = null;

export const loadHandposeModel = async (): Promise<handpose.HandPose> => {
  if (handposeModel === null) {
    console.log('Loading handpose model...');
    handposeModel = await handpose.load();
    console.log('Handpose model loaded!');
  }
  return handposeModel;
};

// Function to count extended fingers
const countExtendedFingers = (landmarks: number[][]) => {
  // Get finger tips positions (index 4, 8, 12, 16, 20)
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];
  
  // Get positions for the base of each finger
  const wrist = landmarks[0];
  const indexBase = landmarks[5];
  const middleBase = landmarks[9];
  const ringBase = landmarks[13];
  const pinkyBase = landmarks[17];
  
  // Check if fingers are extended by comparing y positions
  // (In the camera view, lower y value means higher position)
  let extendedCount = 0;
  
  // For the index, middle, ring and pinky fingers
  if (indexTip[1] < indexBase[1]) extendedCount++;
  if (middleTip[1] < middleBase[1]) extendedCount++;
  if (ringTip[1] < ringBase[1]) extendedCount++;
  if (pinkyTip[1] < pinkyBase[1]) extendedCount++;
  
  // For the thumb (using a different approach as it moves sideways)
  const thumbCMC = landmarks[1]; // Carpometacarpal joint
  const distanceX = Math.abs(thumbTip[0] - thumbCMC[0]);
  if (distanceX > 40) extendedCount++; // Adjust threshold as needed
  
  return extendedCount;
};

export const detectGesture = async (
  video: HTMLVideoElement,
  gestureCallback: (gesture: string | null) => void
) => {
  try {
    const model = await loadHandposeModel();
    const hand = await model.estimateHands(video, true);
    
    if (hand.length > 0) {
      const fingerCount = countExtendedFingers(hand[0].landmarks);
      
      // Map finger count to gesture names
      let gestureName = null;
      if (fingerCount === 1) gestureName = "one_finger";
      else if (fingerCount === 2) gestureName = "two_fingers";
      else if (fingerCount === 3) gestureName = "three_fingers";
      // We could add more mappings if needed
      
      gestureCallback(gestureName);
    } else {
      gestureCallback(null);
    }
  } catch (error) {
    console.error('Error in gesture detection:', error);
    gestureCallback(null);
  }
};
