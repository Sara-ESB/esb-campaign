# E-Service Book Campaign Platform: GitHub + Netlify (free) + Supabase (free)

Email (automatic), SMS, WhatsApp, Pop-up campaigns, accounts (owner / admin / user), Admin panel, activity log.

## What is inside (you should see exactly these names at the TOP of your GitHub repository)
netlify  (folder)   public  (folder)   supabase  (folder)   netlify.toml   package.json   .env.example   README.md

## BEGINNER STEPS (use a laptop with Chrome or Edge, about 40 minutes)

### Step 1. Create 3 free accounts
github.com, supabase.com, netlify.com. In Netlify choose "Sign up with GitHub" so they are linked.

### Step 2. Database (Supabase)
1. New project. Name: esb. Make up a database password and save it. Region: pick Singapore (closest). Create.
2. Wait about 2 minutes. Left menu: SQL Editor -> New query.
3. Open supabase/schema.sql from this folder in Notepad, copy EVERYTHING, paste into Supabase, click Run.
   If it warns about "destructive operations", click "Run this query". It must say "Success".
4. Left menu: Authentication -> Sign In / Providers -> Email -> turn OFF "Confirm email" -> Save.
5. Left menu: Project Settings -> API (or API Keys). Copy and keep in Notepad:
   Project URL, the anon key ("anon" or "Publishable key"), and the service_role key ("service_role" or "Secret key").

### Step 3. Fill in config.js (inside the public folder)
Open public/config.js in Notepad. Paste your Project URL and anon key between the quotes. Save.
(The service_role key NEVER goes in this file.)

### Step 4. Put the files on GitHub
1. github.com -> New repository. Name: esb-campaign. Private. Create.
2. Click "uploading an existing file".
3. Open the unzipped folder, press Ctrl+A to select EVERYTHING inside it, and drag it onto the GitHub page.
   Wait until every file has a green tick. Click "Commit changes".
4. CHECK: your repository page must now list: netlify, public, supabase, netlify.toml, package.json ...
   Click the "netlify" folder: it must contain "functions" and "lib". If the folders are missing, see "Folders did not upload" below.

### Step 5. Put it online (Netlify)
1. Netlify -> Add new site -> Import an existing project -> GitHub -> choose esb-campaign.
2. Leave every setting as it is (Build command empty, Publish directory "public" is read from the file).
3. BEFORE clicking Deploy, open "Environment variables" and add these (one by one), then Deploy:
   SUPABASE_URL, SUPABASE_SERVICE_KEY, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_NAME, SITE_URL,
   TOKEN_SECRET, CRON_SECRET, OWNER_CODE_HASH, DAILY_CAP, HOURLY_CAP, BATCH_SIZE
   Values are in .env.example. For SUPABASE_SERVICE_KEY, SMTP_PASS, TOKEN_SECRET and CRON_SECRET tick "Contains secret values".
   TOKEN_SECRET and CRON_SECRET: make up two different long random texts (30+ letters and numbers).
   SMTP values: ask whoever hosts the info@eservicebook.com.bd mailbox.
4. Wait for "Published". Your address is shown at the top (like https://something.netlify.app).
5. Site configuration -> Change site name: pick a nice name. Then set SITE_URL to the final address
   (Site configuration -> Environment variables -> edit SITE_URL) and Deploys -> Trigger deploy -> Deploy site.

### Step 6. Check your setup
Open: https://YOUR-SITE.netlify.app/api/health?key=YOUR_CRON_SECRET
You should see: every line "set", database "ok", smtp "ok: login works". Fix anything that says MISSING or ERROR.
Also: Netlify -> Functions: "scheduled-send" must be listed (it sends your emails every minute by itself).

### Step 7. Create the owner (do this first)
Open your site -> Owner setup -> your email, a password (6+ characters), the owner code. You become Supreme Admin.

### Step 8. Test
Add yourself as a contact -> Compose -> send yourself an email -> it arrives within about 2 minutes with the logo, button and
unsubscribe link. Click the WhatsApp button (bottom right): it opens a chat with 01714666555.
Sign up a second account in a private window; give it the Admin role in Admin panel -> Users.

### Step 9. Before real sending
Ask your email host to set up SPF and DKIM for eservicebook.com.bd. Start with about 50 emails a day, grow to 300.

## If something goes wrong
- Folders did not upload to GitHub: in your repository click Add file -> Create new file. In the name box type
  netlify/functions/claim-owner.js (typing the slashes creates the folders), paste the file's content, Commit.
  Repeat for every file inside netlify/functions and netlify/lib.
- Netlify build says "secrets scanning found secrets": make sure netlify.toml was uploaded (it lists the safe values).
  If it still happens: Site configuration -> Environment variables -> add SECRETS_SCAN_OMIT_KEYS with the value from netlify.toml, or
  add SECRETS_SCAN_ENABLED = false, then redeploy.
- Site shows "Setup needed": config.js still has the YOUR-... placeholders. Edit it on GitHub (pencil icon) and commit. Netlify redeploys itself.
- Page not found (404): index.html must be inside the "public" folder, and netlify.toml at the top.
- Owner setup says "HTTP 404": the netlify folder is missing from GitHub (see above).
- "Wrong owner code": OWNER_CODE_HASH is missing or wrong (64 characters). Fix it and redeploy.
- "Database error saving new user" or "profile was not found": schema.sql did not finish. Run it again.
- Emails stay "queued": open /api/health?key=... If all is "ok", wait 2 minutes. Netlify Functions -> scheduled-send -> logs shows each run.
  Backup: cron-job.org can call https://YOUR-SITE.netlify.app/api/process-queue?key=YOUR_CRON_SECRET every minute.
- Emails show "failed": the reason is shown in History. Usually SMTP_HOST, SMTP_PORT (465 or 587) or SMTP_PASS is wrong.
- After changing any environment variable: Deploys -> Trigger deploy -> Deploy site.
- Old page after a fix: press Ctrl+Shift+R.

Notes: SMS and WhatsApp campaigns queue messages and you tap Open SMS / Open chat for each one. Fully automatic WhatsApp needs
Meta's WhatsApp Business Platform; automatic SMS needs an SMS gateway. Netlify scheduled functions run only on the published
(production) version. Check Netlify's current free-plan terms for commercial use.
