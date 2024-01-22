# EstoreFrontend

Note: This repository is a part of the Computer Science Capstone project made by the [University of Phoenix](https://www.phoenix.edu/) student [Elena Lazar](https://www.linkedin.com/in/helen-lazar-36315a95/).

This is a simple front-end for a e-commerce solution developed with [Angular](https://angular.io) framework. The back-end code base for this solution is located at [https://bitbucket.org/morrah/estore-backend](https://bitbucket.org/morrah/estore-backend)

Implemented features:
 - main page with the product catalog (the 1st 24 products are fetched from the back end, no pagination or automatic product fetch so far)
 - product details popup available by a click on a catalog item (deep links, i. e., direct browser URLs like `/home;product=2` work); if the product presents in the user's shopping cart, the product quantity is displayed in the appropriate input in the popup interface, and the `Delete from cart` button is available
 - search in the product catalog by a search phrase (the application sends search requests to the back-end, which, in its turn, responds with the list of products whose title or description contain the search phrase)
 - filtering products by category (list of products in the category is displayed; neither the category description display, nor a deep link are not implemented)
 - product cart (user is able to add, remove, and adjust quantity of the products in their cart; to facilitate possible interruptions in using the application, the cart is implemented using browser local storage; check out functionality is not implemanted yet)
 - sign in / sign out (only Google Identity OAuth 2 provider is available so far)
 - order list page (available for authenticated users)
 - simplest user profile page (available for authenticated users)
 - a set of necessary information pages (`About`, `Contacts`, `Privacy policy`, `Terms of service`)

Features to be implemented (the most prioritized first):
 - cart checkout (create an order in the back-end, trigger payment procedure)
 - payment (actual implementation is still to be investigated: due to some legal restrictions, it is impossible for the author to integrate one of well-known payment platforms supporting VISA and MasterCard: such an integration requires a business bank account; probably, some solutions like Google Pay will be more achievable)
 - pagination or endless scrolling (automatic product fetch) on the catalog page
 - links to the product popup in the cart and order list pages (probably, display the popub above these pages)
 - `buy it again` functionality in the order list page
 - category description and deep links for filtered by category product list
 - multiple category selection (the back-end supports this ability)
 - indication of the product categories in the product popup
 - improve authentication (the classic approach with redirect widely used in OAUth2 authentication appeared unimplementable in a single-page application due to the modern browser CORS security policy; probably, the seamless authentication can be implemented either catching the "Location" header in the response or changing the back end endpoint to make it respond with the authentication URL in the response body instead of the "Location" header, and then opening a pop-up browser window with an attached callback function which would load the content from the authentication URL and trigger the provided callback before its close)

##Angular notes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

##Log in with Google Identity

<div id="g_id_onload"
     data-client_id="123"
     data-context="signin"
     data-ux_mode="redirect"
     data-login_uri="https://localhost:8443/login"
     data-auto_prompt="false">
</div>

<div class="g_id_signin"
     data-type="standard"
     data-shape="pill"
     data-theme="outline"
     data-text="signin_with"
     data-size="large"
     data-logo_alignment="left">
</div>

popup

<div id="g_id_onload"
     data-client_id="123"
     data-context="signin"
     data-ux_mode="popup"
     data-login_uri="https://localhost:8443/login"
     data-auto_prompt="false">
</div>

<div class="g_id_signin"
     data-type="standard"
     data-shape="pill"
     data-theme="outline"
     data-text="signin_with"
     data-size="large"
     data-logo_alignment="left">
</div>

#Push/pull

GIT_TRACE=1 GIT_SSH_COMMAND="ssh -vvv -i ~/ssh-new/id_rsa_bb_home" git push -u origin builds/windows:builds/windows

