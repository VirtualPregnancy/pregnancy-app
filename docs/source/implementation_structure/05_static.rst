Static
===========

.. image:: images/04_static.jpg
.. include:: ../style.rst

:green:`STATIC`

-  static folder is home for external javascript files containing zinc,
   dojo charts and models data.
-  img and videos folders are used to store images and videos, linked
   through markdown files stored in assets/data/markdown, respectively.
-  Reorganisation of content in this folder is recommended.

Static Assets (``frontend/static/``)
-----------------------------------

Medical Models
~~~~~~~~~~~~~~

.. code-block:: text

    frontend/static/model/
    ├── normal.vtk            # Normal placenta 3D model
    ├── fgr.vtk              # FGR condition 3D Model
    └── diabetes.vtk         # GDM condition 3D model

Waveform Data
~~~~~~~~~~~~~

.. code-block:: text

    frontend/static/waveforms/
    ├── normal/
    │   ├── time.csv         # Time data
    │   └── signal.csv       # Signal data
    ├── fgr/
    │   ├── time.csv         # Time data
    │   └── signal.csv       # Signal data
    └── gdm/
        ├── time.csv         # Time data
        └── signal.csv       # Signal data

