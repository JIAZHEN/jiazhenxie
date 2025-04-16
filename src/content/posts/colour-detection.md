---
title: Colour Detection
description: Colour Detection by using Python. Tackle the difficulties of removing background and finding the similar colour
date: 2018-05-03
tags: ["uncategorized"]
image: "https://i.ytimg.com/vi/05PYXwBw3Z0/maxresdefault.jpg"
draft: false
---

## Background
In the world of Fashion AI, we have thousands of products to process every day. One of the most important tasks is to identify the colour of the product. While luckily we have a team of 30+ stylists to manually pick up the colours, we've been trying from extracting colour keywords to complicated text classification with machine learning. Neither of them provides a satisfying result.
![image](https://user-images.githubusercontent.com/1108303/39967605-90054394-56b6-11e8-9b73-576637e11605.png)

## Counting the pixels
So I thought the better approach is to get the most commonly used colour on the image, by using Python and [Pillow](http://pillow.readthedocs.org/en/latest/). It doesn't work well as the background colour (which is white in the case) is obviously the most commonly used colour. Clearly, we need to remove the background from the product image.
![image](https://user-images.githubusercontent.com/1108303/39967715-cb1988a8-56b8-11e8-9880-e0e732731410.png)

## Removing the background
The technique that we use to solve this problem is [Grabcut](https://docs.opencv.org/3.4/d8/d83/tutorial_py_grabcut.html) provided by OpenCV. The algorithm required a rectangle that definitely includes the target object, so I make an assumption that the product will always be in the centre of the image. The result is as below
![image](https://user-images.githubusercontent.com/1108303/39967849-ce2727a6-56ba-11e8-9da8-b1efec4a04e2.png)

Perfect! Then we run the most commonly used colour algorithm clearly the blue colour is picked up. But it's not good enough yet. What if we want to identify multiple colours on the image? And if the colour is gradient the mostly used colour cannot represent the group of a colour.

## K-Meaning Clustering
Inspired by Charles Leifer's [post](http://charlesleifer.com/blog/using-python-and-k-means-to-find-the-dominant-colors-in-images/), I use the K-Means algorithm to separate the pixels into K groups (clusters) of similarly coloured pixels. Also, to solve the multiple colours issue I use the MeanShift algorithm as stated in the Xingming Zheng&Ningzhong Liu's [paper](https://ieeexplore.ieee.org/document/6330097/) _Color recognition of clothes based on k-means and mean shift_

![image](https://user-images.githubusercontent.com/1108303/39968025-4826dd82-56be-11e8-911f-ddcb6a9fb90a.png)

Awesome! We've detected all the colours on the image and the blue is the absolute predominant colour.

## Name that colour
The colour in computer science is just a value, quite often it is presented as RGB value. But in the real world, humans need a name to a colour so that we can refer it. That a much more difficult task than it looks. Everyone sees colours differently ...

![image](http://www.thedoghousediaries.com/dhdcomics/2010-03-01-12bf011.png)

Thanks to [XKCD's colour survey](https://blog.xkcd.com/2010/05/03/color-survey-results/), we have 200,000 RGB values with a name. By matching those RGB values with our colour system, we use K-NN classification to train a model so that we can convert a predicted RGB value to the correct name.

Note that we shouldn't use Euclidean to compute the colour distance as human perception on brightness won't take into account. There are [other algorithms](https://en.wikipedia.org/wiki/Color_difference) that try to fix this issue, eventually, I find `CIEDE2000` works for the best in this case.

![image](https://user-images.githubusercontent.com/1108303/39968164-a0326d3c-56c0-11e8-910f-48dbf97bc039.png)

Finally, we've got the accuracy score up to `88%` in our colour detection which I'm so proud of \o/