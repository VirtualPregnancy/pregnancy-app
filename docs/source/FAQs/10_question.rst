Why the route is `pregnancy-changes`?
====================================

Let's look at the `topics.json` file under ./frontend/assets/data/topics.json:

.. code-block:: json

    {
        "pregnancy": {
            "title": "Template",
            "heading": "Te Manawa",
            "icon": "mdi-home",
            "subTopics": {
                "changes": {
                    "title": "Home",
                    "heading": "Heading",
                    "icon": "mdi-home-heart",
                    "category": "success",
                    "subTitle": "subSuccess",
                    "model": { "name": "NoInfarct" }
                }
            }
        }
    }

In here, you can see the first key of the root dictionary is `pregnancy` and the first subTopics key is `changes`, thus the first routes is `pregnancy-changes`.

You can modify those key in json file to change to your own routes.

Notice, after you change the first route, you still need to change the route in `middleware`, under `./frontend/pages/index.vue` line 6.