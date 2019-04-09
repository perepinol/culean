# customerLearningAnalyse

* On displaying proto 1:
    index.html is the login page, and where the user should be redirected when not logged in. For now, the login button redirects automatically to the main page, customerView.html, in which only the "Back" button is wired (taking the user back to the login).

* On running the demo (proto 2):
    The Sprint 2 result is stored in the app and backend folders. The first one stores the scripts that need to be built with webpack. The result of packing is stored in app/build, and those scripts are then copied to the backend folder, which is an Eclipse project.
    
    To summarise, clone the project and run "npm run build". Then copy the files in app/build to backend/WebContent, and the demo can be run in Tomcat v7.0 in Eclipse.

* On running the full application (third deliverable):
    To run the application, simply access http://app3.cc.puv.fi/culean/. Note that this server runs in VAMK's intranet, so VPN is needed. To deploy the application, the backend can be exported into a .war file.
    
* On testing:
    As the project is interface-heavy, we are focusing on user-acceptance testing over unit and integration testing. Thus, at the end of Sprint 2 we do not have any of those tests automated.