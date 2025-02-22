# MegaSense AI ERP

![CI Badge]()
[![codecov]()

### Introduction

MegaSense AI ERP is a prototype for an AI based enterprise resource planning software developed for MegaSense. 

### Used technologies

#### Backend

- [Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)

#### Frontend

- [React](https://react.dev/learn)
- [Vite](https://vite.dev/)
- [Redux](https://redux-toolkit.js.org/tutorials/overview)
- [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)

#### Database

- [aiven](https://aiven.io/)

#### Testing

- [PlayWright](https://playwright.dev/docs/intro)

### Use

In the software you can:

- Add a modules
- Add categories for the modules
- Add and update items for the categories
- ...to be continued

### Documentation

Software documentation available in [Wiki](https://github.com/ohtu-megasense/erp/wiki)

## Development

1. Clone the repo
2. Open two terminals and navigate to the cloned erp root folder in your terminals
3. In one terminal type
```bash
docker compose up
```
4. In the other terminal type
```bash
docker compose exec backend npx ts-node src/database/add_mockdata.ts
```
5. In your web browser go to http://localhost:5173).

## Links

- [Backlog](https://github.com/orgs/ohtu-megasense/projects/2/views/1)
- [Staging](https://megasense-erp-ohtuprojekti-staging.apps.ocp-test-0.k8s.it.helsinki.fi/)
  - VPN need to be enabled (login credentials to University of Helsinki needed)
- ...to be continued e.g. [Production]()


