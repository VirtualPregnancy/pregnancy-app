#!/bin/bash

# Activate virtual environment and start sphinx-autobuild
source venv/bin/activate && sphinx-autobuild source build/html --host 0.0.0.0 --port 8000 --open-browser
