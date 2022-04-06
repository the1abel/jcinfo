# TODO List:
- Show loggedInUser email somewhere so user knows for certain who is logged in
- Sort Events sub-documents (in MongoDB) by Start date while creating/updating them.
  [Example using `$sort:`](https://stackoverflow.com/a/27687159/9974771)
- Add hover effect/popover/search icon/something to "J.C. Info." logo so that it is more obvious how to get back to the home page
- Remove/change focus once a modal is opened, otherwise:
  - Events open and close as Edit Event modal items are clicked
  - Open-modal button still has focus (is highlighted) after modal is closed
- IsUnique operations to use a callback that checks state so that a new request message is not sent every single time the user types a character into any field in the form.