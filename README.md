# resourced.me

[resourced.me](http://resourced.me) is a web application that allows university students to create, search for, and share resource lists with each other.

## Compilation

The CI/CD pipeline automatically compiles and deploys the application when merged to master. When doing manual testing on your own machine, use one of the following workflows:

### Backend Compilation

1. `$ cd backend`
2. Create the `.env` file, with the contents `DB='mongodb+srv://<username>:<password>@cluster0.uobww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'`. **Make sure this is in the backend folder or you will get errors!**. Also add the `GOOGLE_CLIENT_ID`, `ACCESS_TOKEN_SECRET`, and `REFRESH_TOKEN_SECRET`.
3. `$ npm install`
4. `$ node index.js`

Press CTRL+C to terminate the server.

### Frontend Compilation

1. `$ cd frontend`
2. Create the `.env` file, and add the `REACT_APP_GOOGLE_CLIENT_ID`
3. `$ npm install`
4. `$ npm start`

This creates a server that serves the frontend. Press CTRL+C to terminate this server.

## Development workflow

**PUSHING TO MASTER IS DISABLED!!** When developing a feature, you instead create a branch for that feature and then make a **merge it into master** when done. You do this using a merge request through the GitLab interface.

Here is a full guide on how to do this. Ask in Discord in #tech-questions if you're stuck.

1. `$ git checkout master`
1. `$ git pull`
2. `$ git branch <branch-name>`
3. `$ git checkout <branch-name>`
4. Start developing your feature! Commit as normal and push (using `$ git push origin <branch-name>`) as you go.
5. Once your feature is finished, make sure you `$ git fetch` and then `$ git merge origin/master`. Solve any conflicts (this involves going into the conflicting files and correcting the conflicts). Make sure you then `$ git push` if you had to resolve conflicts.
6. Once conflicts are solved, head to GitLab and click Merge Requests in the sidebar, then create a new merge request. Make sure you keep the "delete branch" and "squash commits" checkboxes ticked.
7. In the #code-reviews channel on Discord, ask for someone to review your merge request.
8. Edit your merge request and assign the person doing the code review.
9. The person doing the code review should navigate to your merge request and hit "Approve"
10. Once you have an approval you can hit the merge button.

You're done! Since you just made changes through the GitLab website, it would be a good idea to update your local repository now.
1. `$ git checkout master`
2. `$ git pull`
