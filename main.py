"""
  Test for AR using OpenCV.
"""

## Import dependencies.
# Import numpy for numerical processing.
import numpy as np
# Import the Open Computer Vision library for image processing.
import cv2

# Get an example image as test input.
input = cv2.imread('example.jpg')
newHeight = input.shape[0] * (600 / input.shape[1])
input = cv2.resize(input, (600, input.shape[0]))

# Get an image to use as the augmented overlay.
overlay = cv2.imread('squirrel.jpg')


cv2.imshow("Resized", input)
cv2.waitKey(0)
