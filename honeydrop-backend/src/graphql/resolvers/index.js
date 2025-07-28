import { mergeResolvers } from '@graphql-tools/merge';

import userResolvers from './user.js';
import planResolvers from './plan.js';
import websiteResolvers from './website.js';
import pageResolvers from './page.js';

const resolversArray = [userResolvers, planResolvers, websiteResolvers, pageResolvers];

const mergedResolvers = mergeResolvers(resolversArray);

export default mergedResolvers;
