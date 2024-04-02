# Adapt Essentials: Publish Button

Post to a deploy hook in order to build your Contentful site.
Works well with Netlify and Vercel.

## Installation

1. Clone the repository
1. `npm i && npm run build`
1. In your Contentful space, create a new app
1. Configure the app to have access to the configuration
   screen and the sidebar.
1. Upload the `./dist` directory created during `npm build`
   to the app.
1. Save
1. Configure the app in order to configure your deploy button.
1. Add the deploy button to sidebar content in any content types
   where editors should have access.
