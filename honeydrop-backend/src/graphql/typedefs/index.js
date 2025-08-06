import { mergeTypeDefs } from '@graphql-tools/merge';

import userTypeDefs from './user.js';
import planTypeDefs from './planPackage.js';
import websiteTypeDefs from './website.js';
import pageTypeDefs from './page.js';
import componentLibraryTypeDefs from './componentLibrary.js';

const typeDefsArray = [userTypeDefs, planTypeDefs, websiteTypeDefs, pageTypeDefs, componentLibraryTypeDefs];

const mergedTypeDefs = mergeTypeDefs(typeDefsArray);

export default mergedTypeDefs;
