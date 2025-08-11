import Page from '../../models/Page.js';
import Website from '../../models/Website.js';
import merge from 'lodash.merge';

const DEFAULT_BODY = {
  styles: {
    paddingTop: '0px',
    paddingRight: '15px',
    paddingBottom: '0px',
    paddingLeft: '15px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    // add any other default body styles you want
  },
  layout: {
    // example layout defaults if you want
    type: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  }
};

const pageResolvers = {
  Query: {
    getPagesBySite: async (_, { siteId }, { user }) => {
      const site = await Website.findById(siteId);
      if (!site || String(site.user) !== String(user.id)) throw new Error('Unauthorized');
      return Page.find({ site: siteId });
    },
    getPageById: async (_, { id }, { user }) => {
      const page = await Page.findById(id).populate('site');
      if (!page || String(page.site.user) !== String(user.id)) throw new Error('Unauthorized');
      return page;
    },
  },
  Mutation: {
    createPage: async (_, { input }, { user }) => {
      const site = await Website.findById(input.site);
      if (!site || String(site.user) !== String(user.id)) throw new Error('Unauthorized');
    
      // Initialize body with defaults if not provided
      const pageData = {
        ...input,
        body: input.body ? input.body : DEFAULT_BODY,
      };
    
      const page = new Page(pageData);
      return await page.save();
    },
    updatePage: async (_, { id, input }, { user }) => {
      const page = await Page.findById(id).populate('site');
      if (!page || String(page.site.user) !== String(user.id)) {
        throw new Error('Unauthorized');
      }
    
      for (const key in input) {
        if (key === 'body' && typeof input.body === 'object') {
          // Deep merge body into existing
          page.body = merge({}, page.body || {}, input.body);
        } else {
          page[key] = input[key];
        }
      }
    
      return await page.save();
    },
    deletePage: async (_, { id }, { user }) => {
      const page = await Page.findById(id).populate('site');
      if (!page || String(page.site.user) !== String(user.id)) throw new Error('Unauthorized');

      await page.remove();
      return true;
    },
  },
};

export default pageResolvers;
