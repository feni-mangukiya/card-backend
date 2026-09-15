const { PrismaClient } = require('@prisma/client');
const { DEFAULT_OPTIONS } = require('../utils/constants');

const prisma = new PrismaClient();

const getOrCreateVisitor = async (sessionId) => {
  return prisma.user.upsert({
    where: { sessionId },
    update: {},
    create: {
      sessionId,
      name: 'Daxu'
    }
  });
};

const getCategoryOptions = (category) => {
  return DEFAULT_OPTIONS[category] || [];
};

const getNextSpinResult = async (userId, category) => {
  const previousSpin = await prisma.spin.findFirst({
    where: {
      userId,
      category
    },
    orderBy: { spinNumber: 'desc' }
  });

  const options = getCategoryOptions(category);
  const filtered = previousSpin
    ? options.filter((option) => option !== previousSpin.result)
    : options;

  const finalOptions = filtered.length > 0 ? filtered : options;

  return finalOptions[Math.floor(Math.random() * finalOptions.length)];
};

module.exports = {
  getOrCreateVisitor,
  getCategoryOptions,
  getNextSpinResult,
  prisma
};
