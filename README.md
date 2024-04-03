# Development installation

Clone the repository
```
git clone ...
```

Install dependencies in root project folder
```
npm i
npx lerna bootstrap --hoist
```

Run core dev script
```
npm run dev
```

# Production installation

Clone the repository

```
git clone ...
```

Install dependencies in root project folder
```
npm i
npx lerna bootstrap --hoist
```

Run core build script
```
npm run build
```


Run preview script for check the production mode
```
npm run preview
```

Update server location:
nginx
```
location / {
  try_files $uri $uri/ /index.html;
}
```

# App Notes
The core module is located in the following folder:
```
/apps/core
```