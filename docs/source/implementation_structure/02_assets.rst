Assets Structure
===============

There are three main data assets:
- data: for page content management and configuration
- images, I won't cover this here since it is straightforward to understand.
- sass: for styling

Data Assets
-----------

.. code-block:: text

    frontend/assets/data/
    ├── modelData.js          # 3D model configs and waveform data, used in model component
    ├── landingPageData.js    # Landing page content, used in landing page
    ├── supportData.js        # Support services info, used in support-services page
    └── topics.json           # Educational content structure

Model Configuration
~~~~~~~~~~~~~~~~~~

The `modelData.js` file contains comprehensive configurations for 3D models and their associated data:

The first model is the default model, following this format to add more models by just using data, and the interface will be updated automatically.

.. code-block:: javascript

    export default {
      models: [
        {
          // the first model is the default model
          model: 'normal',  //name of the model, displays as the tag at the 'ConditionSelector' component
          modelName: 'Normal', //name of the model, displays as the title at the `ConditionSelector` component's card part
          Description: 'Normal Placenta', // displays as the description of the model in the `ConditionSelector` component's card part
          color: 'error', // color of tag at the 'ConditionSelector' component
          config: {
            path: '/model/normal.vtk', // store the model under `frontend/static/` and add the path here
            displayName: 'Normal Placenta', // name of the model, displays as the model info at the `Model` component
            color: 0xff2222, // defualt color of the model if no flux/pressure data is provided
            opacity: 1.0, // opacity of the model
            modelSize: 420, // size of the model
            useCylinderGeometry: true, // use cylinder geometry for the model
            cylinderSegments: 10, // number of segments for cylinder geometry
          },
          waveform: {
            xAxis: 'Time (s)', // x-axis label for waveform display
            xDataPath: '/waveforms/normal/time.csv', // store the time data under `frontend/static/` and add the path here
            yAxis: 'Velocity', // y-axis label for waveform display
            lineTitle:'Normal', // line title  for legend at the `Waveform` component
            yDataPath: '/waveforms/normal/signal.csv', // store the signal data under `frontend/static/` and add the path here
            waveformImg: '/img/normal-ultrasound.jpg', // store the waveform image under `frontend/static/` and add the path here, display at the top of the waveform 
            title: 'Umbilical artery blood flow velocity (Normal)', // title of the waveform 
            isPlaying: true, // set playhead to play automatically
            speed: 1, // animation playhead speed multiplier
            description: 'Blood flow characteristics in the umbilical cord can reflect the health of the fetus', // description of the waveform under the waveform
          },
        }
      ]
    }

See the image below for the model confign and the elements on the page:

.. image:: images/02_model_config.png

Landing Page Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~

The `landingPageData.js` file contains the configuration for the landing page:

.. code-block:: javascript

    export default {
        items: [
            {
                index: 0,
                title: 'What is happening in pregnancy?',
                description: 'Information on how your body changes to support your babys growth during pregnancy, and how your midwife/doctor will track the health of you and your baby.',
                image: '/img/landing/pregnancy.svg',
                backgroundColor: '#7A3520',
                link: '/pregnancy-changes'
            },
            {
                index: 3,
                title: 'Navigating pregnancy complications',
                description: 'What you need to know about why complications occur, how they are detected, and what this may mean for your pregnancy journey and beyond.',
                image: '/img/landing/embryo_icon.svg',
                backgroundColor: '#313657',
                link: '/conditions-fetal'
            },
        ]
    }

- **index**: the index of the item, used to sort the items (from left to right, from top to bottom)
- **title**: the title of the card item
- **description**: the description of the card item
- **image**: the image at the left side of the card, store the image under `frontend/static/` and add the path here, you can use an icon instead of an image, just add the mdi icon name here.
- **backgroundColor**: the background color of the item
- **link**: define the page to navigate to when the item is clicked

See the image below for the landing page configuration and the elements on the page:

.. image:: images/02_landing_config.png

Support Services Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. TODO: add the support services configuration documentation

The `supportData.js` file contains the configuration for the support services page:

.. code-block:: javascript

    export default {
        items: [
            {
                index: 0,
                title: 'What is happening in pregnancy?',
                description: 'Information on how your body changes to support your babys growth during pregnancy, and how your midwife/doctor will track the health of you and your baby.',
                image: '/img/landing/pregnancy.svg',
                backgroundColor: '#7A3520',
                link: '/pregnancy-changes'
            },
        ]
    }

Styling Assets
--------------

.. code-block:: text

    frontend/assets/sass/
    ├── global.scss           # Global styles
    ├── base.scss             # Base styles
    ├── variables.scss        # Theme variables
    ├── _mixins.scss         # Reusable mixins
    ├── components/           # Component styles
    └── pages/                # Page styles

Image Assets
-----------

.. code-block:: text

    frontend/assets/images/
    ├── gestures-icons.png    # UI icons
    ├── medtechcore-abi-logo.png
    ├── headshots.png         # Team photos
    ├── kiwirous.png         # Branding
    ├── funding-abi-medtech.png
    ├── Annie-Jones.png      # Team member
    └── Liz-Broadbent.png    # Team member




