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
    
      // Generate domain if not provided, e.g., free plan subdomain
      let domain = input.domain;
      if (!domain) {
        // Example: generate a domain like `${user.id}-${input.name}.honeydrop.site`
        // Make sure to sanitize input.name for URL friendliness in a real app
        domain = `${user.id}-${input.name.replace(/\s+/g, '-').toLowerCase()}.honeydrop.site`;
      }
    
      const newWebsite = new Website({
        ...input,
        user: user.id,
        domain, // override or set domain here
      });

      return await newWebsite.save();
    },    
    deleteWebsite: async (_, { id }, { user }) => {
      const website = await Website.findById(id);
      if (!website) throw new Error('Website not found');
      if (String(website.user) !== String(user.id)) throw new Error('Unauthorized');

      await Website.findByIdAndDelete(id);
      return true;
    },
  },
  Website: {
    user: async (website, _, { loaders }) => {
      return loaders.user.load(website.user); // or UserModel.findById(website.user)
    }
  }
};

export default websiteResolvers;
