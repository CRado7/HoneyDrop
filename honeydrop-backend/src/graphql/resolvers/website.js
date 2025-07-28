import Website from '../../models/Website.js';

const websiteResolvers = {
  Query: {
    getUserWebsites: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return Website.find({ user: user.id });
    },
    getWebsiteById: async (_, { id }, { user }) => {
      const website = await Website.findById(id);
      if (!website) throw new Error('Website not found');
      if (String(website.user) !== String(user.id)) throw new Error('Unauthorized');
      return website;
    },
  },
  Mutation: {
    createWebsite: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      // Optionally: check plan limits here
      const newWebsite = new Website({
        ...input,
        user: user.id,
      });

      return await newWebsite.save();
    },
    deleteWebsite: async (_, { id }, { user }) => {
      const website = await Website.findById(id);
      if (!website) throw new Error('Website not found');
      if (String(website.user) !== String(user.id)) throw new Error('Unauthorized');

      await website.remove();
      return true;
    },
  },
};

export default websiteResolvers;
