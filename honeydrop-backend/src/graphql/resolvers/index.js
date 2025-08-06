import { mergeResolvers } from '@graphql-tools/merge';

import userResolvers from './user.js';
import planResolvers from './plan.js';
import websiteResolvers from './website.js';
import pageResolvers from './page.js';
import componentLibraryResolvers from './componentLibrary.js';

const resolversArray = [userResolvers, planResolvers, websiteResolvers, pageResolvers, componentLibraryResolvers];

const mergedResolvers = mergeResolvers(resolversArray);

export default mergedResolvers;
