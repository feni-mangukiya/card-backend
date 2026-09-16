const { PrismaClient } = require('@prisma/client');
const { normalizeSessionId } = require('../utils/validation');

const prisma = new PrismaClient();

const getFinalGiftBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const normalizedSessionId = normalizeSessionId(sessionId);

    if (!normalizedSessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }

    const user = await prisma.user.findUnique({
      where: { sessionId: normalizedSessionId },
      include: { finalGift: true }
    });

    if (!user) {
      return res.json({
        success: true,
        hasFinalGift: false,
        finalGift: null,
        results: []
      });
    }

    const spins = await prisma.spin.findMany({
      where: { userId: user.id },
      orderBy: { spinNumber: 'asc' }
    });

    const results = spins.map((spin) => spin.result);

    if (!user.finalGift) {
      return res.json({
        success: true,
        hasFinalGift: false,
        finalGift: null,
        results
      });
    }

    return res.json({
      success: true,
      hasFinalGift: true,
      finalGift: user.finalGift.selectedResult,
      results
    });
  } catch (error) {
    next(error);
  }
};

const createFinalGift = async (req, res, next) => {
  try {
    const { sessionId, selectedResult } = req.body || {};
    const normalizedSessionId = normalizeSessionId(sessionId);

    if (!normalizedSessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }

    if (!selectedResult || typeof selectedResult !== 'string' || !selectedResult.trim()) {
      return res.status(400).json({ success: false, message: 'A selected result is required.' });
    }

    const user = await prisma.user.findUnique({
      where: { sessionId: normalizedSessionId },
      include: { spins: true, finalGift: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    if (user.spins.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Two spins are required before choosing a final gift.'
      });
    }

    const validResults = user.spins.map((spin) => spin.result);

    if (!validResults.includes(selectedResult)) {
      return res.status(400).json({
        success: false,
        message: 'Selected result must match one of the completed spins.'
      });
    }

    if (user.finalGift) {
      return res.status(409).json({
        success: false,
        message: 'Final gift has already been selected.'
      });
    }

    const finalGift = await prisma.finalGift.create({
      data: {
        userId: user.id,
        selectedResult
      }
    });

    return res.status(201).json({
      success: true,
      selectedResult: finalGift.selectedResult
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFinalGift,
  getFinalGiftBySession
};
