const { PrismaClient } = require('@prisma/client');
const { normalizeSessionId, isValidCategory } = require('../utils/validation');
const { getOrCreateVisitor, getNextSpinResult } = require('../services/spinService');

const prisma = new PrismaClient();

const getSpinSummary = async (userId) => {
  const spins = await prisma.spin.findMany({
    where: { userId },
    orderBy: { spinNumber: 'asc' }
  });

  return {
    totalSpins: spins.length,
    remainingSpins: Math.max(0, 2 - spins.length),
    results: spins.map((spin) => ({
      spinNumber: spin.spinNumber,
      category: spin.category,
      result: spin.result
    }))
  };
};

const createSpin = async (req, res, next) => {
  try {
    const { sessionId, category } = req.body || {};
    const normalizedSessionId = normalizeSessionId(sessionId);

    if (!normalizedSessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }

    if (!isValidCategory(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category.' });
    }

    const user = await getOrCreateVisitor(normalizedSessionId);

    const existingSpins = await prisma.spin.count({
      where: { userId: user.id }
    });

    if (existingSpins >= 2) {
      return res.status(409).json({
        success: false,
        message: 'Maximum 2 spins already completed.'
      });
    }

    const spinNumber = existingSpins + 1;
    const result = await getNextSpinResult(user.id, category);

    const spin = await prisma.$transaction(async (tx) => {
      const currentSpins = await tx.spin.count({ where: { userId: user.id } });
      if (currentSpins >= 2) {
        throw Object.assign(new Error('Maximum 2 spins already completed.'), { statusCode: 409 });
      }

      const newSpin = await tx.spin.create({
        data: {
          userId: user.id,
          spinNumber,
          category,
          result
        }
      });

      return newSpin;
    });

    const summary = await getSpinSummary(user.id);

    return res.status(201).json({
      success: true,
      spinNumber: spin.spinNumber,
      category: spin.category,
      result: spin.result,
      totalSpins: summary.totalSpins,
      remainingSpins: summary.remainingSpins
    });
  } catch (error) {
    next(error);
  }
};

const getSpinsBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const normalizedSessionId = normalizeSessionId(sessionId);

    if (!normalizedSessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }

    const user = await prisma.user.findUnique({
      where: { sessionId: normalizedSessionId }
    });

    if (!user) {
      return res.json({
        success: true,
        totalSpins: 0,
        remainingSpins: 2,
        results: []
      });
    }

    const summary = await getSpinSummary(user.id);

    return res.json({ success: true, ...summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSpin,
  getSpinsBySession
};
