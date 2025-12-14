Backend Deployment on Vercel
=============================

Deploy Backend to Vercel
-------------------------

Prerequisites
~~~~~~~~~~~~~

- GitHub account
- Vercel account (sign up at https://vercel.com using GitHub Account)
- Backend code pushed to GitHub repository

Deployment Steps
~~~~~~~~~~~~~~~~

1. **Connect GitHub Repository**
   
   - Log in to Vercel dashboard
   - Click "Add New Project"
   - Import your GitHub repository containing the backend code
   - Select the repository

2. **Configure Project Settings**
   
   - **Root Directory**: Select ``backend`` folder
   - **Framework Preset**: Select "Other" or leave as auto-detected
   - **Build Command**: Leave empty (Vercel will auto-detect Python)
   - **Output Directory**: Leave empty

3. **Set Environment Variables**
   
   Click "Environment Variables" and add:
   
   - **Name**: ``GEMINI_API_KEY``
   - **Value**: Your Google Gemini API key
   
   Click "Save" for each environment variable

4. **Deploy**
   
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the deployment URL (e.g., ``https://your-project.vercel.app``)

5. **Verify Deployment**
   
   Visit ``https://your-project.vercel.app/`` in your browser. You should see:
   
   .. code-block:: json

      {
        "status": "ok",
        "message": "Pregnancy AI Assistant",
        "indexed_pages": 45,
        "topics": 5
      }

Configuration Files
~~~~~~~~~~~~~~~~~~~

The backend includes ``vercel.json`` which configures:
- Python runtime
- Route handling for all requests to ``main.py``

No additional configuration needed for basic deployment.

Update Backend API URL
----------------------

After deploying the backend, update the frontend to use the new API URL.

Method 1: Environment Variable (Recommended)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Set the ``BACKEND_API_URL`` environment variable before building:

**Local Development**:
   
   Create a ``.env`` file in the ``frontend`` directory:
   
   .. code-block:: bash

      BACKEND_API_URL=https://your-backend.vercel.app

**Production Build**:
   
   Set environment variable in your deployment platform:
   
   - **Netlify**: Site settings → Environment variables → Add ``BACKEND_API_URL``
   - **GitHub Actions**: Add to workflow secrets
   - **Vercel**: Project settings → Environment Variables → Add ``BACKEND_API_URL``

Method 2: Direct Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Edit ``frontend/nuxt.config.js``:

.. code-block:: javascript

   publicRuntimeConfig: {
     deployEnv: process.env.DEPLOY_ENV || 'local',
     basePath: process.env.DEPLOY_ENV === "GH_PAGES" ? "/pregnancy-app" : "",
     backendApiUrl: process.env.BACKEND_API_URL || 'https://your-backend.vercel.app'
   },

Replace ``https://your-backend.vercel.app`` with your actual Vercel deployment URL.

Usage in Components
~~~~~~~~~~~~~~~~~~~

The backend API URL is accessed in components via:

.. code-block:: javascript

   computed: {
     backendApiUrl() {
       return this.$config.publicRuntimeConfig?.backendApiUrl || 'https://pregnancy-app-tau.vercel.app';
     }
   },

Then use it in API calls:

.. code-block:: javascript

   const response = await fetch(`${this.backendApiUrl}/chat`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ message: userMessage })
   });

Troubleshooting
---------------

**Deployment fails**
   - Ensure ``vercel.json`` exists in the backend directory
   - Check that all dependencies are listed in ``requirements.txt``
   - Verify environment variables are set correctly

**API returns 500 error**
   - Check Vercel function logs in the dashboard
   - Verify ``GEMINI_API_KEY`` is set correctly
   - Ensure ``embeddings.json`` exists in ``backend/data/``

**CORS errors**
   - Backend CORS is configured to allow all origins by default
   - If issues persist, check ``core/config.py`` CORS settings

