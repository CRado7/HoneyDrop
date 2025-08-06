import ComponentLibrary from '../../models/ComponentLibrary.js';

const componentLibraryResolvers = {
  Query: {
    getComponentLibrary: async () => {
      return await ComponentLibrary.find();
    },
    getComponentById: async (_, { id }) => {
      return await ComponentLibrary.findById(id);
    },
  },

  Mutation: {
    createComponent: async (_, { input }) => {
      const component = new ComponentLibrary(input);
      await component.save();
      return component;
    },

    updateComponent: async (_, { id, input }) => {
      const updated = await ComponentLibrary.findByIdAndUpdate(id, input, { new: true });
      return updated;
    },

    deleteComponent: async (_, { id }) => {
      const result = await ComponentLibrary.findByIdAndDelete(id);
      return !!result;
    },
  },
};

export default componentLibraryResolvers;
