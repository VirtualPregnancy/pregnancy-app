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

<<<<<<< HEAD
6. Then the project will be automatically host on your GitHub pages. Go ``settings`` -> ``pages`` to see the link.
=======
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
>>>>>>> dc65147dc6a44d2f3121ac6436452eada54bfea5
