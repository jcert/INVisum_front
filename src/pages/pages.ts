//import { TabsPage } from './tabs/tabs';
import { ListMasterPage } from './list-master/list-master';
import { SearchPage } from './search/search';
import { SettingsPage } from './settings/settings';
import { InVisumWelcomePage } from './in-visum-welcome/in-visum-welcome';
import { InVisumLoginPage } from './in-visum-login/in-visum-login';
//import { InVisumOperatePage } from './in-visum-operate/in-visum-operate';

// The page the user lands on after opening the app and without a session
export const FirstRunPage = InVisumLoginPage; // just for testing, should be login

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = InVisumWelcomePage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = ListMasterPage;
export const Tab2Root = SearchPage;
export const Tab3Root = SettingsPage;
