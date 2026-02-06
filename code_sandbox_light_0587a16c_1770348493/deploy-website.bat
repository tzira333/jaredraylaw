@echo off
echo ============================================
echo Ray Law LLC - Final Deployment
echo ============================================
echo.
echo This script will deploy your website with
echo the Ray Law LLC logo to www.jaredraylaw.com
echo.
echo ============================================
echo.

echo [1/4] Checking files...
echo.
if exist "public\images\logo.png" (
    echo ✓ Logo found: public\images\logo.png
    for %%A in ("public\images\logo.png") do echo   Size: %%~zA bytes
) else (
    echo ✗ Logo missing!
    echo   Copying logo now...
    copy images\logo.png public\images\logo.png
    if exist "public\images\logo.png" (
        echo ✓ Logo copied successfully!
    ) else (
        echo ✗ Failed to copy logo!
        echo   Please manually copy: images\logo.png to public\images\logo.png
        pause
        exit
    )
)
echo.

echo [2/4] Adding files to Git...
git add public/images/logo.png
git add public
git add wrangler.toml
git add .
echo ✓ Files added
echo.

echo [3/4] Committing changes...
git commit -m "Add logo to public folder and deploy Ray Law LLC website"
echo ✓ Changes committed
echo.

echo [4/4] Pushing to GitHub...
git push origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ============================================
    echo ✓ Deployment Started Successfully!
    echo ============================================
    echo.
    echo Your website is now deploying to Cloudflare Pages.
    echo.
    echo This will take approximately 1-2 minutes.
    echo.
    echo ============================================
    echo NEXT STEPS:
    echo ============================================
    echo.
    echo 1. Wait 2 minutes for deployment to complete
    echo.
    echo 2. Check deployment status at:
    echo    https://dash.cloudflare.com
    echo    Go to: Workers ^& Pages -^> jaredraylaw -^> Deployments
    echo.
    echo 3. Clear your browser cache:
    echo    Press Ctrl+F5 on the website
    echo.
    echo 4. Visit your live site:
    echo    https://www.jaredraylaw.com
    echo.
    echo ============================================
    echo WHAT TO EXPECT:
    echo ============================================
    echo.
    echo ✓ Ray Law LLC logo in header
    echo ✓ Ray Law LLC logo in footer
    echo ✓ Logo in browser tab (favicon^)
    echo ✓ Professional blue theme
    echo ✓ Click-to-call: (440^) 413-5311
    echo ✓ All practice areas listed
    echo ✓ Mobile responsive design
    echo.
    echo ============================================
    echo.
) else (
    echo ============================================
    echo ✗ Push Failed
    echo ============================================
    echo.
    echo There was an error pushing to GitHub.
    echo.
    echo Please check:
    echo 1. You are connected to the internet
    echo 2. You have Git configured correctly
    echo 3. You have push access to the repository
    echo.
    echo Try running manually:
    echo   git push origin main
    echo.
)

pause
