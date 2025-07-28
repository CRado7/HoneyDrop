import User from '../../models/user.js';
import PlanPackage from '../../models/PlanPackage.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

export default {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findById(user.id).populate('planPackage websites');
    },
  },
  Mutation: {
    register: async (_, { input }) => {
      const { name, email, password } = input;
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');

      const hashedPassword = await bcrypt.hash(password, 12);

      // Default to free plan - you should seed this in your DB
      const freePlan = await PlanPackage.findOne({ name: 'Free Plan' });

      const user = new User({
        name,
        email,
        password: hashedPassword,
        planPackage: freePlan ? freePlan._id : null,
      });
      await user.save();

      const token = generateToken(user);
      return { token, user };
    },

    login: async (_, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email }).populate('planPackage websites');
      if (!user) throw new Error('Invalid credentials');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');

      const token = generateToken(user);
      return { token, user };
    },
  },
  User: {
    planPackage: async (parent) => await PlanPackage.findById(parent.planPackage),
    // websites can be populated by default, or add resolver if needed
  },
};
