import { InVisumWelcomePage } from './in-visum-welcome/in-visum-welcome';
import { InVisumLoginPage } from './in-visum-login/in-visum-login';

// The page the user lands on after opening the app and without a session
export const FirstRunPage = InVisumLoginPage; // just for testing, should be login

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = InVisumWelcomePage;


