This React.js web app is a checkout process on a fictional e-commerce site that sells code components, and is my second-ever React project. It consists of 5 parts: a signup/login page, cart page, shipping page, payment page, & confirmation page. I originally built this using React class components, about which I have been learning in the Devslopes training program, but ahave recently added a version of the app that uses functional components. The parent component, src/App.js, will remain a class component, as the app was originally made with class components. All other component types will be available as both a class component & as a functional component & will be used consistently, meaning that, in the class version, only class versions will be used, and vice-versa.

In previous revisions, I lifted state up as high as possible (I am not using any state-management tools), which led to having a very lengthy parent component. After learning more about clean code in React, I broke up the components with the goal of making the purpose of each component easier to understand, & to better contain its logic & functionality.

While working on this project, I have learned more about how to organize a React project, styling it (including designing for mobile), and, originally, lots of prop drilling (sharing state values across multiple components). It was during this project that I came to realize the value of things like Zustand, Context API, or Redux in managing React State. I was also able to practice the handling of form inputs (validating input values & displaying error messages, as appropriate).

** No data entered into input fields is stored in any server, unless you choose to save info to your browser's autocomplete functionality, as this project is front-end-only & for practice purposes only. **

To get past the login/signup page to see the rest of the app in action, use 'bruce.twarze@abc.com' as the email & 'Ilikedandelions666#' as the password. You can otherwise go to the signup page & enter data in as it fits requirements in order to advance to the next page. To test a discount code functionality on the cart page, use any of the following: ilikebeachballs, etlb17, devslopes, codeislyfe, jd911.

If you take the time to check out the project in action or read through the code, I would be happy to hear any feedback :)
