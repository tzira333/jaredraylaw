@echo off
echo ========================================
echo Ray Law LLC - Website Deployment Helper
echo ========================================
echo.

echo Step 1: Copying logo to public folder...
copy images\logo.png public\images\logo.png
echo.

echo Step 2: Verifying logo copy...
dir public\images\logo.png
echo.

echo Step 3: Adding files to Git...
git add public
git add wrangler.toml
git add .gitignore
echo.

echo Step 4: Committing changes...
git commit -m "Add public folder with Ray Law LLC logo and all website files"
echo.

echo Step 5: Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo Deployment initiated!
echo.
echo Your site will be live in 1-2 minutes at:
echo https://www.jaredraylaw.com
echo.
echo Check deployment status at:
echo https://dash.cloudflare.com
echo ========================================
echo.
pause
