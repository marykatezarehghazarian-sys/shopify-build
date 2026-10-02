One folder per client. Create one with `npm run client -- new <slug> --name "Name" --domain store.myshopify.com`.

    clients/<slug>/
      client.json   name, store domain, API version (committed)
      .env          that client's tokens (gitignored, chmod 600)
      theme/        that client's theme
      CONTEXT.md    brand, catalog conventions, decisions
