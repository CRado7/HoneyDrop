import Website from '../../models/Website.js';
import User from '../../models/user.js';
import Page from '../../models/Page.js';

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
    
      // Generate domain if not provided
      let domain = input.domain;
      if (!domain) {
        domain = `${user.id}-${input.name.replace(/\s+/g, '-').toLowerCase()}.honeydrop.site`;
      }
    
      // Create and save the new website
      const newWebsite = new Website({
        ...input,
        user: user.id,
        domain,
      });
    
      const savedWebsite = await newWebsite.save();
    
      // Push the new website ID into the user's websites array
      await User.findByIdAndUpdate(
        user.id,
        { $push: { websites: savedWebsite._id } },
        { new: true }
      );
    
      // Create default homepage for this website
      const homepage = new Page({
        site: savedWebsite._id,
        title: 'Home',
        slug: 'home',
        path: '/',
        isHomepage: true,
        isPublished: false,
        body: DEFAULT_BODY, // <-- define this as your default page body content
      });
    
      await homepage.save();
    
      return savedWebsite;
    },           
    deleteWebsite: async (_, { id }, { user }) => {
      const website = await Website.findById(id);
      if (!website) throw new Error('Website not found');
      if (String(website.user) !== String(user.id)) throw new Error('Unauthorized');
    
      // Delete the website
      await Website.findByIdAndDelete(id);
    
      // Remove the website ID from the user's websites array
      await User.findByIdAndUpdate(
        user.id,
        { $pull: { websites: id } },
        { new: true }
      );
    
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
