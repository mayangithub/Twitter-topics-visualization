# twitter-topics-visualization
As a capturer of 2014 American Thanksgiving on Twitter, our project aims at providing a platform to allow people share this festival feeling, discovering what others are talking about on Twitter, the people living in different states may have various concerns about this Thanksgiving festival.

## DESIGN PROCESS

• Initial designing idea <br>
• Crawling data via Twitter APIs <br>
• Using php to clear up data <br>
• Improving layout <br>

## LAYOUT INTRODUCTION

- Geographical map: 
> The reason why we selected to use geographical map is that: we want to compare the Tweets’ amounts throughout the whole America country. The color depth variation could deliver the differences of the Tweets’ amounts in each state in a specific period at the first glance. Geographical map could highlight the relationship between the Tweets’ amounts and the location distribution, and express this relationship in a clearer way. And if the states can be clicked, there can be more interactions with other components.

- Pie Chart: 
> The difference of the Tweets’ amounts in different states is essential to our visualization task. We take advantage of a pie chart to label this difference in a numerical way. By comparing the sizes variations in the pie chart, the changes of Tweets’ amounts are obvious. And combining with the state’s name label, the comparison work about different states’ Tweets amounts can be completed

- Node-Link: 
> As node-link having the capacity to reveal the relationships between different nodes by drawing links based on some numerical correlations. We design a node-link graph based on force-directed layout, which set each hash tag as an individual node, to explore

- Bar Chart: 
> Bar chart is another carrier to complete the comparison between different states’ Tweets’ amounts. The reason why we choose this format is that the bar chart is the most fluent used layout, which means this layout is also intuitive to most people.

## IMPLEMENT

Specifically, we first used php to capture targeted data from Twitter every half hour in our targeted duration. And after getting such a messy dataset, we used nodeJS to filter effective data items, by deleting those items with other location information such as “the place in your heart”, etc, and organizing data into a format that d3 can use. With ideal dataset, we used d3 to construct the end-user interface to present the data. Specifically, we added layouts one by one, by referring the examples in d3js.org; refining them, like linking one layout with other layouts, adjusting some arguments to make some small changes, and adding some other elements to make them better looking.

## Check it out
[Demo link is HERE.](http://picso.org:8889/~classinfovis2014fall/projects/group-jil146/visTweet/) Have fun!

## Shout out
Teamwork is key to this project. Huge thanks go to Jiayu Liu, Shujun Zhang and Yiran Li. 
