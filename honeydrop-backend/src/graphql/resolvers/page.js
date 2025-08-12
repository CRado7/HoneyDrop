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
    createWebsite: async (_, { input }, { user }) => {
      const website = new Website({ ...input, user: user.id });
      await website.save();
    
      // Create homepage with default body
      const pageData = {
        site: website._id,
        title: "Home",
        slug: "home",
        path: "/",
        isHomepage: true,
        isPublished: true,
        body: DEFAULT_BODY,
      };
    
      // Use your existing createPage logic or create Page directly
      const homepage = new Page(pageData);
      await homepage.save();
    
      return website;
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
    
      await Page.findByIdAndDelete(id);
      return true;
    },    
  },
};

export default pageResolvers;
