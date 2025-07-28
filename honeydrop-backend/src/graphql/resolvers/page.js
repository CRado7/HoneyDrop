import Page from '../../models/Page.js';
import Website from '../../models/Website.js';

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

      const page = new Page(input);
      return await page.save();
    },
    updatePage: async (_, { id, input }, { user }) => {
      const page = await Page.findById(id).populate('site');
      if (!page || String(page.site.user) !== String(user.id)) throw new Error('Unauthorized');

      Object.assign(page, input);
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
