# erp

### Links
[backlog](https://github.com/orgs/ohtu-megasense/projects/2)

# MegaSense AI ERP

![CI Badge]()
[![codecov]()

### Introduction

MegaSense AI ERP is a prototype for an AI based enterprise resource planning software developed for MegaSense. 

### Used technologies

#### Backend

- [Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)

#### Frontend

- [React](https://react.dev/learn)
- TypeScript

#### Testing

- [PlayWright](https://playwright.dev/)

#### Database

- [aiven](https://aiven.io/)

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
2. Navigate to the root folder in your terminal
3. In one terminal type ```bash docker compose up```
4. In other terminal type docker compose exec backend npx ts-node src/database/add_mockdata.ts
5. Add http://localhost:5173/ in your web browser

## Links

- [Backlog](https://github.com/orgs/ohtu-megasense/projects/2/views/1)
- [Staging](https://megasense-erp-ohtuprojekti-staging.apps.ocp-test-0.k8s.it.helsinki.fi/)
  - VPN need to be enabled (login credentials to University of Helsinki needed)
