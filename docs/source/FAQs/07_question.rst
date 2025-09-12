How can I add a new page?
========================

.. include:: ../style.rst

When we talk about a new page, that might be:

- `A new page with it's own route` - For example, a new page for "Pregnancy Journey".
- `A new section in an existing page` - For example, a new page under "Pregnancy Journey" like "Changes to your body".

How to add a new page with it's own route?
------------------------------------------

All this is done in the `topics.json` file. Look at this document for more details: :ref:`implementation_structure/01_intro:Data Files`

When you want to config the right side of the page, you can config it in the `pageData` folder. Look at this document for more details: :ref:`implementation_structure/06_pages:Pages Structure`

To sum up, you need:

1. Add a new entry in the `topics.json` file, which contains the route name, title, description, icon. If you want to include any submenu, you can add it in the `subTopics` part in this file.
2. Generate a new file (in .json format) in the `pageData/json` folder, which contains the content of the page, including the sections or components.
   2.1. If this page need model, config `showModel` to `true`.
   2.2. If this page need a component, config `component` to the name of the component, and add the component in the `frontend/components/content` folder.
3. Add the new json file mapping in the `index.json` file under the `pageData/json` folder.

How to add a new section in an existing page?
---------------------------------------------

Which might mean:

1. Add a new sub-topic (i.e. you want to add a new item at the left menu part, and display new content in the right side). In this case, you need to config the sub-topic in the `topics.json` file, and follow the steps in the first case.
2. Add a new section in an existing page. In this case, you need to go to the pageData/json folder, and find the data you are looking for. For example, if you want to add a new section in the "ultrasound-doppler" (this is the route name) page, you need to go to the `pageData/json` folder, and find the `ultrasound-doppler.json` file, and add a new section in the `contentSections` part. Look at this document for the configuration details: :ref:`implementation_structure/06_pages:Pages Structure`
