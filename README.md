# what is this?
This is an AI sketchpad designed to help you master visual thinking, especially when used to solve math problems.

# why is it called thinkn.ink?
That's short for "[thinking ink](https://thinkn.ink)". Literally "ink that thinks". You can use your finger or a stylus to sketch and draw on your mobile device. So you can sketch out the solution to an equation, or diagram/solve a geometry problem. Then you can tap on a button to have an AI tutor read and understand your drawing, and give you step-by-step feedback on your solution. It's not designed to solve the problem for you. It's designed to help you learn to master visual thinking.


# why did you create this?
I love Khan Academy and [watching Sal work](https://www.khanacademy.org/math/algebra2/pythagorean-id/v/pythagorean-trig-identity-from-unit-circle) through problems with the tip of his pen. This visual thinking beautifully demonstrates his mastery of a topic. 

However web forms & multiple choice UIs don't let me develop or demonstrate that type of fluid mastery. The Khan Academy scratchpad UI works, but sadly it's not connected to anything.

[Khanmigo](https://www.khanmigo.ai/) is an amazing way to add AI to Khan Academy. And "[Brave New Words](https://www.amazon.com/Brave-New-Words-Revolutionize-Education/dp/0593656954)" sets out an awesome vision for AI in the future of education too. 

But I believe AI can also help people learn to draw and think with their pen. That's why I built [thinkn.ink](https://thinkn.ink). Just like Khan Academy's scratchpad, but unlocking a whole lot more.

Checkout this 2 minute video of what it's like to use [thinkn.ink](https://thinkn.ink).

[![What is thinkn.ink?](http://img.youtube.com/vi/9aoDmeTxXGs/0.jpg)](http://www.youtube.com/watch?v=9aoDmeTxXGs "What is thinkn.ink?")

Yes, there are AI Equation Solver apps out there already. But [thinkn.ink](https://thinkn.ink) is not the same! They're focused on "solving the problems for you". 

Instead, [thinkn.ink](https://thinkn.ink) is focused on helping you "learn to think through the problem for yourself - by thinking with ink". It's primary goal is to help you learn to master visual thinking.


# why is this useful?
This can help you lock in what you learn by going beyond mastery and into the critical overlearning stage. This is a great way to extend existing learning modules. There's a body of [research into overlearning](https://pmc.ncbi.nlm.nih.gov/articles/PMC5323354/) that shows spending 20-30 minutes working beyond the point you feel you've learned a topic lets you lock that in. It helps your brain process and store the new skill as effectively as "sleeping on it". Otherwise, if you move on to learn another new topic, then that can effectively delete or overwrite what you've just learned. I think this was a common problem I faced when I crammed learning. I could easily hold the ideas for a short period. So I filled my brain with as many as I could. But then they just seemed to evaporate over time.

It can also help you do this regularly through [deliberate and spaced practice](https://www.mathematicshub.edu.au/plan-teach-and-assess/teaching/teaching-strategies/spaced-interleaved-and-retrieval-practice/). By re-visiting random exercises that cover what I learned yesterday, last week and "everything so far" - then I can progressively rehearse and reinforce what I've learned. This is another key to locking in this new knowledge.

Like most people, I've found that lots of the new knowledge I've learned starts to fade. I complete the exercises to demonstrate mastery, but if I don't overlearn and use it practically over the next few weeks and months then it slowly evaporates. I needed a personalised way to regularly practise what I've learned and this is a core part of [thinkn.ink](https://thinkn.ink). Now I have customised AI tutoring that provides an endless supply of personalised exercises and then in depth tutoring based on my own drawings, sketches and solutions. Khan Academy provides the detailed curriculum and [thinkn.ink](https://thinkn.ink) lets me draw and sketch on top of that as much as I want, to build the same type of fluid visual thinking that Sal demonstrates. 

Plus there's something about physically drawing out a problem or equation that makes it more tangible than filling out a form or selecting a multiple choice answer. It engages my motor system and a much broader set of neurons. Now I can regularly practise to continually build upon and lock in everything I learn.


# how does it work?
It uses the [OpenAI chat/completions API](https://platform.openai.com/docs/guides/chat-completions/getting-started) to process the drawing you create using an [HTML canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage).

It costs less than 1c for each drawing the AI processes and the feedback it provides. This means you could do over 100 exercises every day (if you have the time) for less than $1.

I'm using it for a few minutes every day and I think it's a powerful example of how OpenAI's APIs unlock so much more than just text.

I've got a whole range of other fun features I'll be adding to the repos including the ability to talk to your AI tutor in realtime as you draw. This will provide a real "live" tutor. It really is amazing what we can achieve now. (See the features section below).

If you're interested in how these LLM's really work under the hood, encoding knowledge and storing facts then I'd encourage you to watch the [3blue1brown series](https://www.3blue1brown.com/lessons/gpt) on this. It really clearly visualises how this works.


# why do you mention Khan Academy
I'm very grateful for everything Sal has taught me.

I've tried reaching out to Sal directly and to some members of his team, but haven't gotten any response. Perhaps they thought it was spam, or perhaps they thought I was trying to sell something to them. But I'd really love to share these ideas with Sal as I think they'd resonate with him.

If you, or anyone you know has a connection into their team then please share this with them.


# how does the prompt engineering work?
The focus was on setting up a friendly and helpful math tutor. It doesn't solve the problem for you, but focuses on feedback for you about how "you" solved it. A key to this was letting the LLM work through the problem itself before it answered.

It also provides feedback on your equation or diagramming style, to help you learn to master visual thinking.

Then it uses a "few shots" examples to help the LLM return a response that is already formatted with HTML and MathML so it displays nicely.

Ironically, I tried several times to ask the completions API to engineer a good prompt that achieved these goals. It provided what looked like great examples, even though they were very verbose. But when I used them it seems that the few shot examples always failed and the output format was essentially unusable. So the shorter format you see in the code works better and ends up saving on tokens and therefore cost.

I think using LLM's to engineer prompts for LLMs is an interesting area for experimentation though. I'm sure a lot of work has already gone into this and I'm looking forward to diving into this research later.

At the moment this prompt is also focused solely on mathematics. However, I'm confident you could easily adapt this to cover all sorts of structured knowledge domains and scientific diagramming e.g. biology, chemistry, physics, etc. Especially when you combine this with the "questions" feature described below.

NOTE: Sometimes the API does not return nicely formatted results or parts of the MathML might not completely render. LLMs are non-linear and their results will vary. However, I've found the results are consistently good and usable and I'm sure this will just get better and better over time. If you're not happy with the feedback you got then simply close the overlay and then tap on the feedback button again to get another version 8)


# why are some of the features not working?
The version I use does have a lot of these extra features working. Some of them I've removed in this version because I don't want people to have to setup a domain and SSL certificate just to try this out. Some of the other features I haven't finished testing and refining, so I've removed the code and will release that in the future.

In the meantime I've left the complete UI in place so you can see how the whole app would work.

Here's an overview of each of the features available in the menus.

## drawing menu
From top to bottom

### close
![close button](/individual-buttons/close.png)

This closes the `drawing menu` and shows the `main menu`.

### pen
![pen button](/individual-buttons/pen.png)

This selects the `pen` mode so you can draw by touching and dragging your finger or stylus.

### eraser
![eraser button](/individual-buttons/eraser.png)

This selects the `eraser` mode so you can erase any drawing by touching and dragging your finger or stylus.

### undo
![undo button](/individual-buttons/undo.png)

This lets you undo that last stroke you drew.

### clear
![clear button](/individual-buttons/clear.png)

This clears the whole canvas.

### snapshot
![camera button](/individual-buttons/camera.png)

This lets you use the camera to take a snapshot of an existing equation or diagram so you can work over the top of that like a template. This feature has been removed from this repos because `getUserMedia()` requires SSL.

### export
![export button](/individual-buttons/export.png)

This lets you export the current drawing using the [download attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download). I haven't implemented this yet as I haven't really needed it.

### calculator
![calculator button](/individual-buttons/calculator.png)

This shows a calculator overlay so you don't have to leave the app to do simple calculations. I'm not happy with the visual design of the current version so I've removed that for now.

## main menu
From right to left

### hamburger
![hamburger button](/individual-buttons/hamburger.png)

This lets you open the `drawing menu` and closes the `main menu`.

### questions
![question button](/individual-buttons/question.png)

This shows an overlay that has a few different functions.
- If you haven't already asked the AI tutor for a question or exercise, or you want a new one then this lets you do that.
- If you have a current question then it lets you view that.
- If you want other help about the app then this links to more information too.

I'm not happy with the UX of the process for asking new questions so I've removed this functionality for now.

This also provides some interesting options for the prompt engineering. If you already know the question that the drawn equation or diagram is trying to solve, then you can use this as an input for the LLM. This is even more useful if we extended this to support other structured knowledge domains and scientific diagramming e.g. biology, chemistry, physics, etc.

### feedback
![feedback button](/individual-buttons/submit.png)

This is the heart of the whole app. It lets you ask the AI tutor for feedback on your current drawing. At the moment this makes a new call every time you tap on this button. I'll add a feature that just re-shows the current feedback if the diagram hasn't changed, and an option to refresh it too.

### live
![live button](/individual-buttons/live.png)

This lets you open a live audio chat with your AI tutor using the OpenAI Realtime API. I haven't finished implementing and testing this yet so I've removed this functionality. But I think it's a pretty interesting experiment and I'll release the updated code as soon as it's ready.


# how do I get this working?
All you need to do is:
- clone this repos
- run `npm install`
- update `public/app.js` to add your own OpenAI API key
- start the server by running `node server.js $YOUR_IP`
- load this app on your mobile device e.g. `http://$YOUR_IP:8080`

Then just start drawing equations and sketching out solutions. Once you're ready to get feedback on your work tap on the `X` in the top of the menu on the left (if that's there). Then tap on the `star with a tick` icon to ask the AI agent to review your work.

If you want the app to work in full screen then just save it to your homescreen and launch it from there.


# why isn't is a PWA (progressive web app)?
The version I use is a PWA. But I've removed this code so it doesn't require any SSL certificates and a domain name to get it running. The goal was to make it as simple as possible for people to try it for themselves.

I'll put this code back in and add a config option that lets you enable this in the future.


# why are there bugs?
This is really just a prototype and for my own personal use. I've regularly use it on my iPhone and it's very stable there. I've tested it on some Android devices and it seems to work fine. But I have noticed some issues with the undo there. I'll do more testing and refine the code as I go, lots of things could be tidied up and simplified. All PRs and suggestions are welcome.


# why isn't this available as a working app at [thinkn.ink](https://thinkn.ink)?
Well, I don't want to cover the OpenAI API costs for you to use this app 8) So I've made this an Open Source solution, then you can install it and use your own OpenAI API token instead.

I think it's a really useful app and I've been using it for a few minutes every day. But I don't think it's a standalone service on it's own. And I really don't want to "get my hustle on" to try to build a paying user base. That's why I've contributed this for free.

I hope you enjoy using it and I'd love to hear any feedback you might have.


