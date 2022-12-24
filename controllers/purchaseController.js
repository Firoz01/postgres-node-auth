const prisma = require("../client");
const catchAsync = require("../utils/catchAsync");

exports.createPurchase = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await prisma.purchase_info.create({
    data: {
      package_id: req.body.package_id,
      variation_id: req.body.variation_id,
      vocavive_id: req.body.vocavive_id,
    },
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json("can't create purchase");
  }
});
