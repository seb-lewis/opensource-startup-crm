# BottleCRM

never use $app from sveltekit. ref: https://kit.svelte.dev/docs/packaging#best-practices

# dev
nvm use 22.13.0
npx prisma generate
npx prisma migrate dev

for development, run both sveltkeit and wss
npm run dev
npm run wss

# before comitting for deployment
run `npx eslint src --ext .svelte`
run `pnpm run build` to check for errors, warnings and fix.
run `npx svelte-check` to check for errors and warnings to fix

# prod
nvm use 22.13.0
npx prisma generate
npx prisma migrate deploy