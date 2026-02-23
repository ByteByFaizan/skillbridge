Product Requirements Document (PRD)

Product Name: SkillBridge – AI Career Guidance Platform
1. PROBLEM STATEMENT

Students—especially those in colleges and early career stages—struggle to make informed career decisions due to lack of personalized guidance, information overload, and misalignment between their skills and industry requirements.

Key pain points:

Career guidance is often generic, expensive, or not localized

Students do not understand which skills are actually required for real-world jobs

No clear, step-by-step career roadmap

Confusion leads to wasted time, wrong career choices, and demotivation

👉 There is a clear need for an accessible, AI-powered system that provides personalized, actionable, and realistic career guidance tailored to individual students.

2. GOALS & OBJECTIVES (SMART)

Provide personalized career recommendations

Generate at least 2–3 career paths for 95% of active users within 10 seconds of profile submission.

Reduce career confusion


Enable actionable learning plans

Ensure 100% of career recommendations include a complete 6-month learning roadmap.

Improve engagement and retention

Democratize career guidance


3. SUCCESS METRICS

Career Recommendation Completion Rate ≥ 95%

User Satisfaction Score (CSAT) 

Roadmap Completion View Rate 



4. TARGET PERSONAS
Persona 1: College Student (Early Career)

Demographics

Age: 18–22

Education: Undergraduate (B.Tech / B.Sc / B.Com)

Location: India (Tier 2 / Tier 3 cities)

Pain Points

Unsure which career fits their skills

Overwhelmed by online advice

No mentor or career counselor

Goals

Identify best-fit career

Learn relevant skills efficiently

Get job-ready before graduation

Technical Proficiency

Medium (basic tools, learning platforms)

Persona 2: Career Switcher / Fresher Graduate

Demographics

Age: 22–26

Education: Graduate / Postgraduate

Background: Non-CS transitioning to tech or data roles

Pain Points

Doesn’t know where to start

Confused by industry requirements

Afraid of making wrong investment in courses

Goals

Clear career transition plan

Understand skill gaps

Enter job market confidently

Technical Proficiency

Low to Medium

5. FEATURES & REQUIREMENTS

1. Smart Career Discovery

Description
AI analyzes user profile to suggest best-fit career paths.

User Story
As a student, I want career suggestions based on my interests and skills so that I can choose the right direction.

Acceptance Criteria

User must enter interests, skills, and education

System returns 2–3 career paths

Each career includes explanation and relevance

Response time 

Success Metric


2. Personalized Learning Roadmap

Description
AI generates a structured 6-month learning roadmap.

User Story
As a student, I want a month-wise roadmap so that I know exactly what to learn next.

Acceptance Criteria

Roadmap spans exactly 6 months

Each month lists topics and tools

Includes at least 1 learning platform per month

Roadmap is downloadable or savable

Success Metric



3. Skill Gap Analysis

Description
Compares user skills with career requirements.

User Story
As a student, I want to see missing skills so that I can focus my learning.

Acceptance Criteria

Clearly separates “existing” vs “missing” skills

Assigns priority (High / Medium / Low)

Displays per career path

Success Metric

4. Career Dashboard

Description
Central dashboard for saved careers and progress.

User Story

As a user, I want to track my career progress in one place.

Acceptance Criteria

View saved career paths

See roadmap progress

Access recommendation history



USER SCENARIOS
Scenario 1: Confused First-Year Student

Context
A student unsure about career options.

Steps

User enters profile details

AI analyzes input

System displays career paths + roadmap

Expected Outcome

User receives clear career direction

Edge Case

If skills are empty → system prompts examples

Scenario 2: Career Switcher to Data Field

Context
Graduate wants to move into data analytics.

Steps

User asks AI chat question

AI provides skill gap + roadmap

User saves career path

Expected Outcome

Actionable transition plan

Error Handling

If goal is vague → AI asks clarification

Scenario 3: Returning User

Context

User revisits dashboard after 2 weeks.

Steps

User logs in

Dashboard shows saved progress

AI suggests next steps

Expected Outcome

Increased engagement

NON-FUNCTIONAL REQUIREMENTS

Performance:

AI response time 

Security:

No sensitive personal data stored without consent

Accessibility:

Simple language (Grade 8 reading level)

Constraints

API usage limits

Budget for AI calls

Accuracy dependent on user input quality

