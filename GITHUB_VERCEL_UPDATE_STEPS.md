# Updating the Redline Outline Spec Builder

These instructions assume the existing GitHub repository is named `redline-outline-spec-builder` and is already connected to Vercel.

## Part 1: Download and unzip the update

1. Download the new ZIP file.
2. Right-click the ZIP file and choose **Extract All**.
3. Open the extracted `Redline_Outline_Spec_Builder` folder.
4. Confirm that it contains:
   - `dist`
   - `source`
   - `scripts`
   - `README.md`
   - `GITHUB_VERCEL_SETUP.md`
   - `GITHUB_VERCEL_UPDATE_STEPS.md`

## Part 2: Replace the files in GitHub

1. Open GitHub in your web browser.
2. Open the existing `redline-outline-spec-builder` repository.
3. On the repository page, click **Add file**.
4. Click **Upload files**.
5. Open the extracted `Redline_Outline_Spec_Builder` folder on your computer.
6. Select everything inside that folder.
7. Drag the selected folders and files onto the GitHub upload page.
8. Wait until GitHub finishes listing the files.
9. In the commit message box, enter:

   `Update Outline Spec Builder to Version 3.0`

10. Select **Commit directly to the main branch**.
11. Click **Commit changes**.

GitHub will replace files with the same names and add any new files. The repository itself and its web address remain the same.

## Part 3: Let Vercel deploy the update

Because Vercel is already connected to the GitHub repository, committing to `main` should automatically start a deployment.

1. Open Vercel.
2. Open the existing Redline Outline Spec Builder project.
3. Click **Deployments**.
4. Look for the newest deployment.
5. Wait until its status says **Ready**.
6. Open the existing production website.
7. Refresh the page.
8. Confirm that the header says **Version 3.0**.

You do not need to create a new Vercel project or change the production URL.

## If the website still shows Version 2.0

1. On the Vercel **Deployments** page, open the newest deployment.
2. Confirm that it was deployed from the `main` branch.
3. Use the deployment menu and choose **Redeploy**.
4. After it is ready, reopen the production website.
5. Press **Ctrl + F5** to force the browser to load the new files.

## If Vercel displays a 404 page

Open the Vercel project settings and confirm:

- Framework Preset: **Other**
- Root Directory: repository root
- Build Command: blank
- Output Directory: `dist`
- Install Command: blank

Save the settings and redeploy the newest deployment.
