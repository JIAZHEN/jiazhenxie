---
title: Building the Engineering Capacity Planner - Solving the Resource Planning Puzzle
description: Engineering Manager Tools
date: 2024-09-04
tags: ["uncategorized"]
image: "https://bs-uploads.toptal.io/blackfish-uploads/components/blog_post_page/4093803/cover_image/regular_1708x683/0309_Your_role_in_delivering_great_products_as_an_Engineering_Manager_Zara_Newsletter___blog-67996821bb55e5b0e2a07a80a6392013.png"
draft: false
---

In my career as a software engineering manager, I've experienced the art of resource planning firsthand. And trust me, it’s as much an art as it is a science. Managing people’s time effectively is like trying to hit a moving target—factors like public holidays, employee absences, personal holiday allowances, and unexpected sick days constantly shift the balance. Not to mention, some team members (like myself at times) juggle between leadership responsibilities and individual contribution, making it even more challenging to get an accurate read on capacity.

## So, What is Resource Planning, and Why Do We Need It?
Hold on. Let’s not get ahead of ourselves. First, what exactly is resource planning, and why is it such a big deal? According to the formal definition from the [Project Management Institute](https://www.pmi.org/learning/library/resource-planning-project-management-10567),

> Resource planning is a process of determining the resources required to complete the project. It is a critical part of project management that involves estimating the resources needed to complete the project. Resource planning helps to ensure that the project is completed on time and within budget. It also helps to identify any potential risks that may arise during the project.

Sounds very textbook, doesn’t it?

In my experience, the definition boils down to this: As a manager, whether in engineering or any other domain, you need to know your team’s capacity. Without this knowledge, you risk either overcommitting and burning out your team or underutilising them, which leads to missed deadlines and opportunities. It’s like packing for a trip—you don’t want to overstuff your suitcase, but you also don’t want to leave out essentials. Balance is key!


## The Resource Planning Problem: It's Not as Simple as Counting Heads
You might think resource planning is straightforward—just count how many people you have, and you’re done, right? Not quite. There are layers to this challenge, especially in an engineering setting. Here’s why:

1. **Bank Holidays**: Depending on your region, these can vary widely, and not accounting for them can give you an inflated sense of available workdays.
2. **Absences & Sick Leaves**: People need time off, whether planned or unplanned, and each day someone is out, your team’s capacity drops.
3. **Holiday Allowances**: Many employees have unused vacation days, and if you don’t account for them in your planning, you could face a last-minute rush.
4. **Mixed Roles**: Some members of your team might split their time between management and actual coding (again, speaking from experience!). These folks aren’t at 100% availability for hands-on work, so adjustments need to be made.

All these factors make resource planning a bit like solving a Rubik’s cube—twist one side, and everything else shifts.

## The Solution: Enter the Engineering Capacity Planner
Frustrated by the guessing game that resource planning can sometimes feel like, I built a tool that takes the headache out of the process: the Engineering Capacity Planner. This tool is designed specifically to help engineering managers (and honestly, anyone who leads a team) calculate their team’s true capacity over a given period.

Here’s how the tool tackles the problem:

- **Tracking Absences**: It keeps track of every type of absence—planned holidays, sick leaves, and even half-days. You won’t be blindsided by any unexpected gaps in availability.
- **Factoring in Holidays**: The tool automatically accounts for public and bank holidays, making sure your calculations aren’t thrown off by a long weekend or national celebration.
- **Adjusting for Mixed Roles**: If someone splits their time between management and development, you can assign an "engineering factor" to adjust for their reduced availability. That way, no one is overbooked or underutilized.
- **Capacity vs. Commitment**: The planner gives you a snapshot of your team's total capacity versus how much work is already committed. It’s an immediate, visual representation of whether your team is in danger of overcommitting—or if you have room for more work.

You can find this nifty tool here: [Engineering Capacity Planner](https://github.com/JIAZHEN/em-capacity-app)

## The Bottom Line: How Much Can My Team Really Achieve?
![image info](./../../images/em-capacity-planning_img1.png)

After putting all this into practice, you can finally answer that elusive question: “How much work can my team realistically achieve in a given time frame?”

Let’s say your team has 1,000 days of capacity between now and the end of the year. The planner shows that you’ve already committed to 200 days of work. With this information, you have a clear idea of how to prioritize and allocate resources without running your team into the ground or letting valuable time slip away.

The Engineering Capacity Planner is not just a tool for engineering managers—it’s for anyone who needs to effectively plan resources. Whether you’re managing a product team, a marketing department, or any other team where time is money, this tool can give you that golden insight into what your team can really achieve.

So, no more guesswork. Resource planning doesn’t have to be a mystery anymore!