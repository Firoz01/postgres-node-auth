const prisma = require("../client");
const catchAsync = require("../utils/catchAsync");

exports.createParchase = catchAsync(async (req, res) => {
  const result = await prisma.parchase_info.create({
    data: {
      package_id: req.body.package_id,
      variation_id: req.body.variation_id,
      vocavive_id: req.body.vocavive_id,
      coursebook_id: req.body.coursebook_id,
    },
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json("can't create parchase");
  }
});
