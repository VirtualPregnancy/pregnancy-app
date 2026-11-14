Deploy on GitHub Pages
=========================

When we deploy the project on GitHub Pages we need to create a gh-pages branch, we don't need to create this branch manually!

Here are the steps we host the project on GitHub pages.

1. Set up the base route for ``generate project``, because we want to deploy the project on ``https://github.com/<USERNAME>/<REPO>``. So we need to config our project base route with our REPO name in nuxt.config.js.

.. code-block:: bash
    :linenos:

    const routerBase =
    process.env.DEPLOY_ENV === "GH_PAGES"
        ? {
            router: {
            base: "/<your REPO>/",
            },
        }
        : {};
    export default {
        ...routerBase
    }

2. Set the ``target`` and ``generate`` in nuxt.config.js

.. code-block:: bash
    :linenos:

    export default {
        target: "static",
        ...routerBase,
        generate: {
            dir: "build",
            routes: [
            "/model-heart",
            "/attack-healthy",
            "/attack-minor",
            "/attack-severe",
            "/electricity-healthy",
            "/electricity-fibrillation",
            "/failure-healthy",
            "/failure-compensated",
            "/failure-decompensated",
            ],
        },
    }

3. Set the package command in package.json

.. code-block:: bash
    :linenos:

    {
        "scripts": {
            "dev": "nuxt",
            "build": "nuxt build",
            "start": "nuxt start",
            "generate": "nuxt generate",
            "build:gh-pages": "DEPLOY_ENV=GH_PAGES nuxt build",
            "generate:gh-pages": "DEPLOY_ENV=GH_PAGES nuxt generate"
        },
    }

4. Modify the code when finished

.. code-block:: bash
    :linenos:

    yarn generate:gh-pages
    git add .
    git commit -m "Ready to host on a GitHub pages"
    git push origin main

5. After you merge your local code to your main branch, we need to generating `gh-pages` branches

.. code-block:: bash
    :linenos:

    git subtree push --prefix=build origin gh-pages

6. Then the project will be automatically host on your GitHub pages. Go ``settings`` -> ``pages`` to see the link.


7. Option 2: Deploy the APP in GitHub Pages via GitHub Actions:

    Step 1: same steps by follow above steps from 1 to 4, but don't need to run `yarn generate:gh-pages`.

    Step 2: under root folder create a `.github/workflows/deploy.yml` file.

    Step 3: In your Github account `settings/Developer settings/ Personal access tokens/Tokens(Classic)` -> click `Generate new token`.

    Step 4: Select the `Personal access tokens (classic)`, then select `workflow` and select the Expiration date.

    Step 5: Copy the token, then go to your App repo's `settings/Secrets and variables/ Actions` ->  click `New repository secret` -> then paste your token there and give a name for the secret.

    Step 6: Copy the secret name for paste in Step 7.

    Step 7: then modify below script to yours.
        .. code-block:: bash
            :linenos:

            name: Deploy App via Github action
            on:
              release:
                types: [created]

            jobs:
              build:
                runs-on: ubuntu-latest

                steps:
                  - uses: actions/checkout@v3
                  - uses: actions/setup-node@v3
                    with:
                      node-version: 16
                  - run: cd frontend && yarn install && yarn generate:gh-pages
                  - run: ls

                  - uses: peaceiris/actions-gh-pages@v3
                    with:
                      github_token: ${{secrets.Your_secret_name}}
                      publish_dir: "./frontend/build"

    Step 8: everytime when you push your code to Github, after merge it, you can create a release, Then github actions will automatically run the script and deploy the app in Github Pages.


Alternative approach: Deploy with the repository GitHub Actions workflow
==========================================================================

The instructions above describe the original manual deployment approach. This
repository also includes a GitHub Actions workflow at
``.github/workflows/deploy.yml``. This alternative approach builds and deploys
the application automatically when changes are pushed to the ``main`` branch.

Unlike the original GitHub Actions example above, this workflow:

* uses the GitHub Pages artifact and deployment actions;
* does not require a personal access token or a repository secret;
* does not require a manually managed ``gh-pages`` branch; and
* supports both automatic and manually triggered deployments.

The following steps are for someone setting up the project after cloning the
repository for the first time.

1. Install the required tools
-----------------------------

Install Git, Node.js 16, and Yarn 1.x. The workflow uses Node.js 16 and the
repository stores its frontend dependency versions in
``frontend/yarn.lock``.

2. Clone the repository
-----------------------

Open a terminal and clone the repository:

.. code-block:: bash

   git clone https://github.com/VirtualPregnancy/pregnancy-app.git
   cd pregnancy-app

If you are working from a fork, replace the URL with the URL of your fork.

3. Install the frontend dependencies
-------------------------------------

Move into the frontend directory and install the dependencies using the
repository lock file:

.. code-block:: bash

   cd frontend
   yarn install --frozen-lockfile

4. Test the deployment build locally
-------------------------------------

Run the same static-generation command used by the workflow:

.. code-block:: bash

   yarn generate:gh-pages

The generated site is written to ``frontend/build``. When the command
completes successfully, return to the repository root:

.. code-block:: bash

   cd ..

The GitHub Pages base path is configured as ``/pregnancy-app/`` in
``frontend/nuxt.config.js`` when ``DEPLOY_ENV`` is set to ``GH_PAGES``.

5. Push the workflow to GitHub
------------------------------

Check the files that will be committed, then push the changes to the
``main`` branch:

.. code-block:: bash

   git status
   git add .
   git commit -m "Deploy app to GitHub Pages"
   git push origin main

The ``push`` trigger in ``.github/workflows/deploy.yml`` starts the workflow
automatically after the push.

6. Configure GitHub Pages to use GitHub Actions
------------------------------------------------

In the GitHub repository:

1. Open **Settings**.
2. Select **Pages** under **Code, plamning, and automation**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Save the setting if GitHub displays a Save button.

The workflow already declares the permissions it needs:
``pages: write`` and ``id-token: write``.

7. Check the workflow run
-------------------------

1. Open the repository's **Actions** tab.
2. Select **Deploy App via GitHub Pages**.
3. Open the newest workflow run.
4. Confirm that both the ``build`` and ``deploy`` jobs complete successfully.
5. Open the URL shown for the ``github-pages`` environment. To check if the latest changes are live, check when the site was last deployed. 

For this repository, the expected Pages URL is:

.. code-block:: text

   https://<YOUR-GITHUB-USERNAME>.github.io/pregnancy-app/

The first deployment may take a few minutes to become available.

8. Run a deployment manually
-----------------------------

The workflow also has a ``workflow_dispatch`` trigger. To run it manually:

1. Open the repository's **Actions** tab.
2. Select **Deploy App via GitHub Pages**.
3. Select **Run workflow**.
4. Choose the ``main`` branch.
5. Select **Run workflow** again.

Use this option to redeploy the current ``main`` branch without creating a
new commit.