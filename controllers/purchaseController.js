const prisma = require("../client");
const catchAsync = require("../utils/catchAsync");

exports.vocaviveCreatePurchase = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await prisma.purchase_info.create({
    data: {
      package_id: req.body.package_id,
      variation_id: req.body.variation_id,
      vocavive_id: req.body.vocavive_id,
    },
  });
  if (result) {
    res.status(200).json({
      status: "success",
      message: "Purchase information for vocavive created successfully",
      data: result,
    });
  } else {
    res.status(500).json("can't create purchase for vocavive");
  }
});

exports.getPurchaseInfoForVocavive = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const info = await prisma.purchase_info.findMany({
    select: {
      package_id: true,
      variation_id: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (info) {
    res.status(200).json({
      status: "success",
      message: `found purchase information with this id: ${id}`,
      data: info,
    });
  } else {
    res.status(404).json(`No purchase information found with this id: ${id}`);
  }
});
