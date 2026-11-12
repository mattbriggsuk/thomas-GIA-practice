# GIA Practice

GIA Practice is a browser-based app for practising the five types of aptitude task in the Thomas International General Intelligence Assessment (GIA). It helps you learn each task, build speed and accuracy, and review your answers after a timed session.

The app runs locally using plain HTML, CSS and JavaScript. No account, installation, build step or internet connection is required.

## What you can practise

| Test | What you do |
| --- | --- |
| Reasoning | Read and remember a comparison between two people, then answer a question after the statement disappears. |
| Perceptual Speed | Compare four pairs of letters and count the matches, treating uppercase and lowercase as the same letter. |
| Number Speed & Accuracy | Find the smallest and largest of three numbers, then choose whichever is furthest from the remaining number. |
| Word Meaning | Choose the odd word out from three words; the other two share a meaning, an opposite meaning or a category. |
| Spatial Visualisation | Count symbol pairs that match after rotation, without reflection. |

Each test starts with instructions and a worked example. Questions are randomised; Word Meaning draws from a curated word bank.

## Getting started

1. Keep the supplied HTML, JavaScript, CSS and PDF files together in this folder.
2. Open `index.html` in a modern browser, such as Chrome, Edge, Firefox or Safari. JavaScript must be enabled.
3. Choose a test, read its instructions, and select **Start practice**.
4. Click an answer or press its displayed option number (`1` to `5`). Keyboard numbers select positions, so option `1` can represent the answer `0`.
5. Select **Complete & review** whenever you want to finish, or let the session timer expire.

In Reasoning, select **Show question** after reading the statement. Reading time counts towards your answer time. **Space** or **Enter** continues a reasoning statement or an answer-feedback screen.

If your browser restricts storage when opening files directly, you can serve the folder locally instead. With Python installed, run this command from the app folder:

```sh
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Practice settings

Open **Settings** at the top of any page to adjust the settings shared by all five tests:

| Setting | Default | Allowed range |
| --- | --- | --- |
| Session duration | 120 seconds | 30 to 1,800 seconds |
| Target time per answer | 5 seconds | 0.5 to 120 seconds |
| Accuracy goal | 80% | 1% to 100% |
| Feedback after each answer | Off | On or off |

Changes apply to the next session. With feedback enabled, the app shows the result and explanation after each answer and pauses the session clock until you select **Next question**. Otherwise, it moves straight to the next question. Opening Settings or switching browser tabs does not pause an active session.

## Results and progress

At the end of a session, the review shows:

- Correct answers and accuracy percentage.
- Average answer time, including time spent on incorrect answers.
- The number of answers that were both correct and within your time target.
- A question-by-question review with your answer, the correct answer and an explanation.
- A **Download results** button to export the full review as JSON.

A practice **PASS** means you submitted at least one answer, met your accuracy goal, and kept your average answer time at or below your target. An unfinished question appears in the review but is excluded from accuracy and average answer time. Active session time includes time spent on that question.

Settings and up to 100 session summaries are saved in your browser's local storage. The home page displays the ten most recent summaries. Full question reviews can be downloaded from the results screen; they are not stored in the history. Saved data is specific to the browser and origin you use. Private browsing, storage restrictions or clearing browser data can affect persistence.

## Project files

| File | Purpose |
| --- | --- |
| `index.html`, `dashboard.js` | Home page, test selection and recent session summaries. |
| `reasoning.html`, `reasoning.js` | Reasoning test and question generator. |
| `perceptual-speed.html`, `perceptual-speed.js` | Perceptual Speed test and question generator. |
| `number-speed-accuracy.html`, `number-speed-accuracy.js` | Number Speed & Accuracy test and question generator. |
| `word-meaning.html`, `word-meaning.js` | Word Meaning test and word bank. |
| `spatial-visualisation.html`, `spatial-visualisation.js` | Spatial Visualisation test and question generator. |
| `shared.js` | Shared interface, settings, timers, scoring, history and results export. |
| `styles.css` | Styles for all pages. |
| `tests/` | Node.js checks for question generation and local HTML asset references. |

## Checking question generation

With Node.js installed, run these commands from the app folder. No package installation is needed:

```sh
node tests/check-generators.cjs
node tests/check-number-speed-accuracy.cjs
```

The first script checks 5,000 generated questions per test and verifies local HTML asset references. The dedicated number test checks the five reference examples in every screen order, 13,800 exhaustive screen-order checks, and cases involving lowest-number answers, numeric sorting, negative numbers and equal distances. Equal distances use a lowest-number fallback in the question builder; generated practice questions exclude ties.

## About the practice material

This is independent preparation material with original practice questions inspired by the supplied example booklet. It is not affiliated with Thomas International and is not an official assessment. Session lengths and pass/fail targets are configurable practice goals. The app does not apply an official scoring formula, percentile conversion or wrong-answer penalty, and its results do not predict official GIA scores.
