const router = require("express").Router();
const {
  getActiveOffers,
  getAllOffers,
  createOffer,
  toggleOffer,
  deleteOffer,
} = require("../controllers/offerController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getActiveOffers);
router.get("/all", protect, adminOnly, getAllOffers);
router.post("/", protect, adminOnly, createOffer);
router.put("/:id/toggle", protect, adminOnly, toggleOffer);
router.delete("/:id", protect, adminOnly, deleteOffer);

module.exports = router;