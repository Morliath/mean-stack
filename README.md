# mean-first-app

For integrated build:

- build angular app (ng build --prod)
- copy dist files to backend/angular
- add config to serve the files to app.js
  - app.use("/", express.static(path.join(__dirname, "angular")));
  - app.use((req, res, next) => {
      res.sendFile(path.join(__dirname, "angular", "index.html"));
     });
  - comment CORS headers
