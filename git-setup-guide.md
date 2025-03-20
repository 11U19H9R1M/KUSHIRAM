
# Git Repository Setup Guide

Follow these steps to push your code to a GitHub repository:

## Prerequisites
- Git installed on your computer
- GitHub account created
- Terminal/Command Line access

## Steps to Push to GitHub

1. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com) and sign in
   - Click the "+" icon in the top right corner and select "New repository"
   - Name your repository (e.g., "time-travelers-archive")
   - Choose visibility (public or private)
   - Click "Create repository"

2. **Initialize Git in your project (if not already done)**
   ```bash
   git init
   ```

3. **Add all your files to staging**
   ```bash
   git add .
   ```

4. **Commit your files**
   ```bash
   git commit -m "Initial commit"
   ```

5. **Connect your local repository to GitHub**
   ```bash
   # Replace YOUR_USERNAME and YOUR_REPOSITORY_NAME with your GitHub username and repository name
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   ```

6. **Push your code to GitHub**
   ```bash
   git push -u origin main
   ```
   Note: If your default branch is called "master" rather than "main", use:
   ```bash
   git push -u origin master
   ```

## Troubleshooting

If you encounter errors about the branch name:
- Try using `git branch -M main` before pushing to rename your local branch to "main"
- Or replace "main" with "master" in the push command

If you're prompted for GitHub credentials:
- Consider setting up an SSH key for GitHub or using a personal access token

## Subsequent Pushes

After your initial setup, you can push changes with:
```bash
git add .
git commit -m "Your commit message"
git push
```
