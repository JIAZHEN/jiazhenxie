---
title: "How I achieved 83% accuracy in auto-labelling on production"
description: "We would like to predict the correct garment features from the garment title and description, by using Machine Learning. Furthermore, it's important to actually make the model production ready."
date: 2018-01-04
tags: ["uncategorized"]
image: "https://itsupplychain.com/wp-content/uploads/2022/03/AdobeStock_170135489.jpg-900-x-636.jpg"
draft: false
---

## Description
Previously in Dressipi, the Auto-Labelling worked as extracting feature keywords from garment title and description, then passed onto stylists to moderate the auto-labelled features. That means engineers have to maintain a list of keywords for each partner on per category basis, then requires human resources to inspect all of them.

We would like to predict the correct garment features from the garment title and description, by using Machine Learning. Furthermore, one of the targets is to 100% automate some features labelling, namely, not require human resources to moderate the predicted garment features.

## Technical considerations
The garment population program is run in Ruby, it auto-labels new garment sequentially. Namely, the model will be called while the ruby program is running. Therefore the prediction model will need to be called by Ruby, in real-time.

## Category prediction
Predicting garment category from the description and title was the first task we tackled. 
[AWS Machine Learning](https://aws.amazon.com/machine-learning/) was a great option, in this case, it allows us to train the model and enable a real-time prediction endpoint with hassle-free. By feeding one year’s garment feed records (essential attributes are brand name, product name and description), we successfully implemented models with `92%` overall accuracy! Moreover, the category real-time prediction endpoint works perfectly on production. As a result, we quickly rolled out the models on production.

## Feature prediction
The second task was to build Machine Learning models to predict garment features. With the great success in AWS Machine Learning, we instinctively tried to build models with it. By feeding with garment title, long description, short description, category name and feature category name, with AWS Machine Learning we only got `65%` overall accuracy, which was obviously not good enough. Besides, we didn’t have much control of the AWS Machine Learning model such as changing the algorithm. As the rise of AI as well as the popularity in Python, we naturally turned onto the other direction - [Scikit-Learning](http://scikit-learn.org/stable/).

First of all, we put all texts (such as description, title, garment material) in [bag-of-words](https://en.wikipedia.org/wiki/Bag-of-words_model) model, preprocess the data by removing HTML, special characters and stop-words. Then, converting the string of words to a matrix of [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) features so that it’s ready to be fed into a machine learning model. In order to find the best suitable model, we do the cross valuation by models in which comparing algorithms like [Logistic Regression](https://en.wikipedia.org/wiki/Logistic_regression), [K-nearest Neighbors](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm), [Decision Tree](https://en.wikipedia.org/wiki/Decision_tree), [SVM](https://en.wikipedia.org/wiki/Support_vector_machine) and [Random Forest](https://en.wikipedia.org/wiki/Random_forest).

![cross-val-by-models](https://user-images.githubusercontent.com/1108303/34576368-a3403df2-f175-11e7-9355-7bffd69a4ae9.png) 

As you can see in the resulting image, the first number is the mean value of cross valuation while the later is the standard deviation of it. It is clear that Random Forest algorithm is the best choice for now.

There’s a problem here, product title is shorter than the description and the word in it should have more weights than in the description. So instead of using bag-of-words, we switch to feature union which could deal with title and description separately, in a different weight. At the end, we completed the model with overall `83%` accuracy! How great it is!

![image](https://user-images.githubusercontent.com/1108303/34576467-e1c21a78-f175-11e7-9307-fc99405fdb56.png)

# Production engineering
Although we successfully trained the model, from the software engineering point of view, there’s a challenge ahead - how to use the sciki-learn built the model in ruby in real-time ... There was a lot to consider: load the trained models into memory, sending garment data from ruby process to Python process and getting the prediction, avoiding deadlock in lower level streams ... Long story in short, we eventually used IO pipe (Open3.popen3 in ruby) to implement the real-time prediction endpoint (Be aware of memory usage, stdout/stdin deadlock and error handling! - this could be another post).

# Review the auto-labelling statistics
After rolling out the scikit-learn models to auto-labelling, it’s time to review the accuracy performances. At the beginning, we calculate the percentage of the number of features in auto feature sets that is actually in final feature sets of garments. Since `2017-12-15` to `2018-1-2`, 

```
Total predicted features: 57, 294
Total wrongly predicted features: 3, 272
Overall accuracy: 94.29%
```

Also, by comparing to the period between `2016-12-15` and `2017-1-3` and the one between `2017-12-15` and `2018-1-2`, looking at the garment feature categories that are using Random forest model, the accuracy rates have gone up at least twice (See the screenshot below). Further, we have a few 100% rate on some garment feature categories.

![image 1](https://user-images.githubusercontent.com/1108303/34576687-a66f6ede-f176-11e7-921d-bda5531ce80e.png)
## Things have been tried
[AWS Sagemaker](https://aws.amazon.com/sagemaker/) - great service includes hosted Jupyter notebooks that make it is easy to explore and visualize the training data stored in Amazon S3. It allows to use custom algorithm like the one we do in Scikit-Learn. Once model is built, it’s production ready and fully-managed by AWS. So we can avoid all the pains in IO pipes.

[Forest-confidence-interval](http://contrib.scikit-learn.org/forest-confidence-interval/) - This package adds to scikit-learn the ability to calculate confidence intervals of the predictions generated from Random Forest. This is an implementation of an algorithm developed by Wager et al. [Wager2014](http://contrib.scikit-learn.org/forest-confidence-interval/#wager2014) and previously implemented in R. We want to quantify the confidence level of a prediction result so that the auto-labelled features can be 100% automated. We haven’t decided how should use it. Examples are as below:
![wallis-nylon - stretch](https://user-images.githubusercontent.com/1108303/34579712-19f8a36a-f182-11e7-9bf4-659e6951b5bd.png)
![wallis-polyesterpolyamide - stretch](https://user-images.githubusercontent.com/1108303/34579740-36183010-f182-11e7-97d1-cf5c460b7245.png)

[Random Forest predict_proba](http://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html) - Rather than predicting the most likely feature name directly, get the probabilities of each feature. We could probably define a threshold saying “if the probability of a garment’s fibre being ViscoseRayon - Mix is over 0.7, we confident that’s correct”
![con-wallis-viscoserayon - mix](https://user-images.githubusercontent.com/1108303/34579852-9c3fcfba-f182-11e7-8824-c04b90739714.png)