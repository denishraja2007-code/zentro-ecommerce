const Offer = require("../models/Offer");

// Public: active and not expired
exports.getActiveOffers = async (req, res, next) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $exists: false } }, { expiresAt: { $gt: now } }],
    }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    next(err);
  }
};

exports.getAllOffers = async (req, res, next) => {
  try {
    res.json(await Offer.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
};

exports.createOffer = async (req, res, next) => {
  try {
    const { title, description, code, expiresAt } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });
    const offer = await Offer.create({
      title,
      description,
      code,
      expiresAt: expiresAt || undefined,
    });
    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
};

exports.toggleOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    offer.active = !offer.active;
    await offer.save();
    res.json(offer);
  } catch (err) {
    next(err);
  }
};

exports.deleteOffer = async (req, res, next) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer deleted" });
  } catch (err) {
    next(err);
  }
};