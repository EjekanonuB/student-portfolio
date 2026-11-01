# Ejekanonu Benjamin Chukwudum | Academic & Technology Portfolio

This project is a five-page academic portfolio and productivity website built with HTML5, CSS3, and vanilla JavaScript.

## Pages
- Home
- About Me
- Projects
- Academic Planner
- Contact

## Features
- Responsive layout for desktop, tablet, and mobile devices
- Consistent global design system and reusable UI components
- Task management dashboard with Local Storage persistence
- Contact form front-end validation
- Project filtering and navigation interactions
- Homepage audio and video players with native browser controls

## Local preview
Open `index.html` directly in a browser, or run a local static server:

```bash
cd student-portfolio
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Adding homepage audio and video
The homepage media players look for these optional files:

- Audio: `assets/audio/portfolio-introduction.mp3` or `assets/audio/portfolio-introduction.ogg`
- Video: `assets/video/portfolio-introduction.mp4` or `assets/video/portfolio-introduction.webm`

Add your own media using one of the listed formats and filenames. The video player uses the profile placeholder image as its poster. Add captions to the video before publishing it; no media files are included by default.
