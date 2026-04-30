#!/bin/bash
mkdir -p career-exploration-app/{frontend,backend,docs}
cd career-exploration-app
git init
echo "# Career Exploration App\n## Setup\n1. Install Node.js, Python, MongoDB\n2. Frontend: `cd frontend && npm init -y && npm install react`\n3. Backend: `cd backend && python -m venv venv && pip install flask`" > README.md
echo "node_modules\nvenv\n*.pyc" > .gitignore
git add . && git commit -m "Initial project setup"
# Replace with your GitHub repo URL
# git remote add origin <your-repo-url>
# git push -u origin main