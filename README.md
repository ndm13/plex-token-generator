# plex-token-generator
Lightweight authentication token generator for Plex API access

Available live on [GitHub Pages](https://ndm13.github.io/plex-token-generator/)

## What is this?

Plex allows users to integrate with its services through an API. Typically this is done by creating some
sort of application that implements their authentication framework, but there are some use cases where
building a custom app is overkill.

This tool is just the "get me an authentication token" piece of an app, which means you can make a
custom "app" that shows up in your list of authorized services and gives you API access without needing
to develop anything yourself. Enter the name you want to show up and generate/enter a UUID for your
app, and the Generate PIN button will take you through the device link process just like any other app,
except this time it'll hand you back an auth token that you can plug into whatever you're building.

All of this runs in the browser, and no data is sent to any third parties.  If you're paranoid, you can
clone the project and run it locally.
