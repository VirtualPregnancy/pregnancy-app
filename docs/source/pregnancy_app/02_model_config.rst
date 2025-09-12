Model Configuration
===================

The overall model configuration is handled in two main files: `VTKLoader.js` for rendering logic and `Model.vue` for model types.
For specific configuration, please refer to the :ref:`implementation_structure/02_assets:Model Configuration` document.

Color Mapping
-------------

VTKLoader supports three color mapping types:

**Pressure-based Mapping**
- Green (0.23, 0.70, 0.27) → Orange (0.98, 0.93, 0.00) → Dark Red (0.56, 0.12, 0.00)

**Flux-based Mapping** 
- Blue (reverse flow) → Cyan → Green → Yellow → Red (high flow)

**Default Mapping**
- Arterial vessels: Red (0xff2222)

.. code-block:: javascript

   // Color mapping configuration in VTKLoader.js
   const COLOR_CONSTANTS = {
     COLOR_MAPPING: {
       NONLINEAR_EXPONENT: 0.4,
       NEUTRAL_VALUE: 0.5,
       LOW_TO_MID: {
         RED_START: 0.23, RED_RANGE: 0.75,
         GREEN_START: 0.70, GREEN_RANGE: 0.23,
         BLUE_START: 0.27, BLUE_RANGE: -0.27
       },
       MID_TO_HIGH: {
         RED_START: 0.98, RED_RANGE: -0.42,
         GREEN_START: 0.93, GREEN_RANGE: -0.81,
         BLUE_START: 0.00
       }
     }
   };

Waveform
--------
The waveform is under the component ``frontend/components/model/Waveform.vue``, which used `eCharts <https://echarts.apache.org/en/index.html>`_ to display the data. If you want to config the waveform, like adding a tooltip or change basic color, please refer to the echarts documentation.

For title/label/line color ect, look into the document :ref:`implementation_structure/02_assets:Model Configuration`.