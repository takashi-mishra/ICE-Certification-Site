# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Certificate verification behavior ✅

- QR codes now embed the full certificate payload (base64-encoded JSON) so scanning the QR opens a verification URL that contains the data needed to display the certificate.
- This means scanning from another device (mobile/other browser) will show the verified certificate even if the original device's localStorage is not available.

How to test:

1. Generate a certificate in the app and open the certificate preview or Download it.
2. Scan the QR code with another device (phone). The link opened will contain an embedded payload and should render the verified certificate page.

Notes:
- The app still supports local verification (localStorage) when accessed on the original device.
- For stronger security in production, consider signing the payload on a server so it cannot be forged locally.
- To reduce QR density and improve scan reliability, the app now compresses the embedded payload using `lz-string` when available. Install it locally: `npm i lz-string`.
- If deploying to Vercel or other static hosts, add a rewrite so SPA routes (like `/verify/:id`) return `index.html`. Example `vercel.json`:

```json
{
  "rewrites": [ { "source": "/(.*)", "destination": "/index.html" } ]
}
```

This ensures links like `/verify/<id>` work when opened directly (e.g., from a scanned QR link).

Print behavior note:
- The printed/downloaded certificate no longer prints the full embedded payload (very long link) to avoid multi-page certificates; the PDF shows a short verify URL and the QR code which contains the full payload. Scan the QR to verify or copy the short link to open the certificate page. (This keeps printed certificates compact.)
