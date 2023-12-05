# Web App Template

[![Read the Docs][readthedocs]][readthedocs-url]

## Setup Project

### With backend

- Clone template to PC

```sh
git clone https://github.com/ABI-CTT-Group/web-app-template.git
cd web-app-template
```

- Setup backend
    - environemnt: python 3.9+
```sh
cd backend
pip install -r requirements.txt
uvicorn myapp:custom_app_instance --reload
```

- Setup frontend
    - environment: node 16.14.0, yarn 1.22.19
```sh
cd frontend
yarn
yarn dev
```

### Without backend

- delete backend folder
- modify code in frontend

```sh
# delete components/model/Model.vue async fetch() line 17 ~ 27
```

- put your data into static folder, then you can the data file path into your frontend code directly.



[readthedocs]: https://img.shields.io/readthedocs/web-app-template
[readthedocs-url]: https://web-app-template.readthedocs.io/en/latest/