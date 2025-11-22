---
description: How to publish the project to GitHub
---

To publish your changes to GitHub, follow these steps:

1.  **Check your remote configuration**:
    You currently have a remote named `habit` configured.
    ```bash
    git remote -v
    ```

2.  **Push your changes**:
    Run the following command to push your code to the `main` branch on the `habit` remote.
    ```bash
    git push habit main
    ```

3.  **Authentication**:
    -   If this is your first time pushing or your credentials have expired, a window should pop up asking you to sign in to your GitHub account.
    -   Follow the on-screen instructions to authorize the application.
    -   Once authorized, the push will proceed.

4.  **Verify**:
    -   Go to https://github.com/ramykamaldev/habit to see your changes.
