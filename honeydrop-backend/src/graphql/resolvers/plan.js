import PlanPackage from '../../models/PlanPackage.js';

export default {
  Query: {
    planPackages: async () => await PlanPackage.find(),
    planPackage: async (_, { id }) => await PlanPackage.findById(id),
  },
};
