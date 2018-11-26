#  ATW Renewal prototype

This project uses the [GOV.UK Prototype Kit](https://govuk-prototype-kit.herokuapp.com/docs).

Pushing to the master branch will automagically deploy to https://atw-renewal.herokuapp.com/

# Project structure

Different versions of this prototype can be created by defining a collection pages in the `app/data/journeys.json` file

Each version must be in the format `v*` as the app will create symlinks of the different version numbers into the views folder so the pages can be shared between each version

Pages that collect data should be placed in the `views/question` folder, this will enable the app to distinguish them from other pages and build the progress indicator (page 1 of whatever) above the question on that page