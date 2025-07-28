import { mergeTypeDefs } from '@graphql-tools/merge';

import userTypeDefs from './user.js';
import planTypeDefs from './planPackage.js';
import websiteTypeDefs from './website.js';
import pageResolvers from '../resolvers/page.js';

const typeDefsArray = [userTypeDefs, planTypeDefs, websiteTypeDefs, pageResolvers];

const mergedTypeDefs = mergeTypeDefs(typeDefsArray);

export default mergedTypeDefs;
