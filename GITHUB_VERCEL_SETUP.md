# GitHub and Vercel Setup

## What to upload

Upload the contents of this folder to the root of a private GitHub repository. Do not upload the outer ZIP file itself.

The repository root should show:

- `dist/`
- `scripts/`
- `source/`
- `README.md`
- `GITHUB_VERCEL_SETUP.md`

The `dist` folder is the deployable application. Do not move its files or flatten its `assets` folder.

## Create the GitHub repository

1. Sign in at `https://github.com`.
2. Select the plus sign in the upper-right corner and choose **New repository**.
3. Enter `redline-outline-spec-builder` as the repository name.
4. Set visibility to **Private**.
5. Leave **Add a README**, `.gitignore`, and license unselected because this package already contains the required files.
6. Select **Create repository**.

## Upload the files through the GitHub website

1. Extract the ZIP on your computer.
2. Open the extracted `Redline_Outline_Spec_Builder` folder.
3. On the empty GitHub repository page, select **uploading an existing file**.
4. Drag all five items listed above into the GitHub upload area. Drag the contents of the folder, not the outer folder or ZIP.
5. Confirm that GitHub shows files beneath `dist/assets`, `scripts`, and `source`.
6. Enter `Initial Redline Outline Spec Builder upload` as the commit message.
7. Select **Commit changes**.

## Connect the repository to Vercel

1. Sign in at `https://vercel.com` using the account connected to GitHub.
2. Select **Add New** and then **Project**.
3. Find `redline-outline-spec-builder` and select **Import**.
4. Use these project settings:

   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: leave blank or override it with no command
   - Output Directory: `dist`
   - Install Command: leave blank

5. No environment variables are required.
6. Select **Deploy**.
7. After deployment succeeds, open the generated `.vercel.app` URL.
8. Confirm that the top bar says **Version 2.0** and the Section Library reports **1,079 master sections**.

## Normal update process

Keep `main` as the production branch. Each committed update to `main` will trigger a new production deployment. Branches and pull requests can be used for preview deployments before changes are merged.

## Project-file workflow

The website does not centrally store project data. Save each `.rspec` project file in the normal Teams or SharePoint project folder. Coordinate one editor at a time, then reopen the latest `.rspec` file in the app. Word exports download to the user's computer.

## Access reminder

A private GitHub repository protects the source repository but does not automatically restrict the deployed website. Configure Vercel Deployment Protection if the production site must require authentication.
