How to Update Embeddings After Modifying Knowledge Base?
========================================================

.. include:: ../style.rst

Knowledge Base Files to Update
-------------------------------

- :blue:`frontend/assets/data/topics.json`
- :blue:`frontend/pages/_slug/pageData/json/*.json` (all JSON files except ``sample.js``)

Update Steps
------------

1. **Setup Python virtual environment**:
   
   .. code-block:: bash

      cd backend
      python -m venv venv
      source venv/bin/activate  # On Windows: venv\Scripts\activate

2. **Install requirements**:
   
   .. code-block:: bash

      pip install -r requirements.txt

3. **Set environment variable**:
   
   .. code-block:: bash

      echo "GEMINI_API_KEY=your_api_key_here" > .env

4. **Run embedding script**:
   
   .. code-block:: bash

      python scripts/generate_embeddings.py

5. **Deploy updated file**:
   
   - Commit and push ``backend/data/embeddings.json``
   - Restart backend server (if local)
