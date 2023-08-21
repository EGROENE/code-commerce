This React.js web app is a checkout process on a fictional e-commerce site that sells code components. It consists of 5 parts: a signup/login page, cart page, shipping page, payment page, & confirmation page. I built this using React class components, about which I have been learning in the Devslopes training program. I know functional components are in vogue now, but being able to work with and understand class components still has some value, as many older programs written in React still use this kind of component.

This project involved practicing organizing a React project, styling it (including designing for mobile), and, originally, lots of prop drilling (sharing state values across multiple components). It was during this project that I came to realize the value of things like Zustand or Redux in managing React State, though I have no experience with these tools whatsoever (yet). I was also able to practice the handling of form inputs.

However, I refactored the code according to the principle that, in a React application, one should make as many components as possible stateless, so now the App component in src/App.js is the only parent component in the project. I defined all state values in src/App.js, as well as all methods, passing down state values & methods to the child components as props as necessary. Though this reconfiguration took a bit of time to plan & execute, it resulted in the app being more efficient (less time rendering components), as well as more scalable & less confusing, as prop drilling is no longer necessary. As part of the reconfiguration, I also conditionally rendered the 5 parts of the checkout process instead of conditionally hiding them; this keeps the DOM clean.

** No data entered into input fields is stored in any server, unless you choose to save info to your browser's autocomplete functionality, as this project is front-end-only. **

To test the login feature, use 'bruce.twarze@abc.com' as the email & 'Ilikedandelions666#' as the password. You can otherwise go to the signup page & enter data in as it fits requirements in order to advance to the next page. To test a discount code functionality on the cart page, use any of the following: ilikebeachballs, etlb17, devslopes, codeislyfe, jd911.

If you take the time to check out the project in action or read through the code, I would be happy to hear any feedback :)
