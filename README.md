# AiCruit 


## Inspiration
The inspiration came from the fact that the current recruitment processes has many glitches. many of us have taken jobs that were not a good fit. When a person's personality doesn't' fit the job everyone looses. Not only they will be unhappy with their unsuitability for the role, but the organisation will probably suffer from increased absenteeism and low productivity. So in AiCruit we study the personality of a candidate to make sure he isn't hired for an unsuitable job.

## What it does
AiCruit tracks the list of applications for the job. Candidates details can be seen by recruiter which includes basic information of candidate, a graph between the his two personality profiles and his/her response to personality questions. It also includes the summary of resume, highlighting the important sections. A word cloud made from the recommendation letter keywords is also available. For making better recommendations AiCruit uses trade off to its best. It selects best candidates for the job based on their scores on the personalty, honesty and recommendation letter sections.

## How we built it
As a forth year under graduate students we noticed a lot of people taking up wrong jobs, thus saying "I hate Mondays". So we decided to make recruitment an intelligent process. We wanted to minimize the efforts required in shortlisting the candidates. We have used 4 Watson services. AiCruit maps personality of a candidate to the job profile using Personality insights service. Resume and recommendation letter are analysed using Document conversion and Alchemy keywords and sentiment api. We made use of Trade-off Analytics service for recommending best fits for the job.

## Challenges we ran into
* Mapping of candidates personality to job description personality
* Finding honesty score
* Creating a system which is efficient and easy to use at the same time

## Accomplishments that we're proud of
* Honesty score to determine reliability of a candidate
* Saving time spent on recommendation letter using word cloud

## What's next for AiCruit
AiCruit is currently a prototype. We aim to make it a full fledged system wherein an Human resource team can collaboratively work together to find the best candidates, who will love their jobs and increase productivity of the organization.

### Project details video
[![Project details video](https://img.youtube.com/vi/FPenz5S0c-E/0.jpg)](https://www.youtube.com/watch?v=FPenz5S0c-E)

### Winners showcase video by IBM Watson India 
https://www.youtube.com/watch?v=Uonls331aJ8

### Built With 
* bluemix
* charts.js
* d3.js
* ibm-watson
* node.js
* watson-developer-cloud
