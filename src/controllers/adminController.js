const { PrismaClient } = require('@prisma/client');
const { ADMIN_STATS_DEFAULTS } = require('../utils/constants');

const prisma = new PrismaClient();

const getAdminStats = async (req, res, next) => {
  try {
    const [totalVisitors, totalSpins, completedSessions, finalGiftSelections] = await Promise.all([
      prisma.user.count(),
      prisma.spin.count(),
      prisma.user.count({
        where: { spins: { some: {} } }
      }),
      prisma.finalGift.count()
    ]);

    res.json({
      success: true,
      stats: {
        totalVisitors: totalVisitors || ADMIN_STATS_DEFAULTS.totalVisitors,
        totalSpins: totalSpins || ADMIN_STATS_DEFAULTS.totalSpins,
        completedSessions: completedSessions || ADMIN_STATS_DEFAULTS.completedSessions,
        finalGiftSelections: finalGiftSelections || ADMIN_STATS_DEFAULTS.finalGiftSelections
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAdminSpins = async (req, res, next) => {
  try {
    const spins = await prisma.spin.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      spins: spins.map((spin) => ({
        id: spin.id,
        visitor: spin.user.sessionId,
        spinNumber: spin.spinNumber,
        category: spin.category,
        result: spin.result,
        createdAt: spin.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

const getAdminUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        spins: { orderBy: { spinNumber: 'asc' } },
        finalGift: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      users: users.map((user) => ({
        id: user.id,
        visitor: user.name || user.sessionId,
        sessionId: user.sessionId,
        spin1: user.spins[0]?.result || '—',
        spin2: user.spins[1]?.result || '—',
        finalGift: user.finalGift?.selectedResult || '—',
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

const getAdminFinalGifts = async (req, res, next) => {
  try {
    const gifts = await prisma.finalGift.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      finalGifts: gifts.map((gift) => ({
        id: gift.id,
        visitor: gift.user.sessionId,
        selectedResult: gift.selectedResult,
        createdAt: gift.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminSpins,
  getAdminUsers,
  getAdminFinalGifts
};
