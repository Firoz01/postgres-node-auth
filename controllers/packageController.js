const prisma = require("../client");
const catchAsync = require("../utils/catchAsync");



exports.createPackage = catchAsync(async (req, res) => {
  const {
    name,
    title,
    expiration,
    bdt,
    discount_bdt,
    usd,
    discount_usd,
    status,
  } = req.body;
  const newPackage = await prisma.package.create({
    data: {
      name: name,
      title: title,
      variations: {
        create: {
          expiration,
          bdt,
          discount_bdt,
          usd,
          discount_usd,
          status,
        },
      },
    },
    include: {
      variations: true,
    },
  });
  console.log(newPackage);
  res.status(200).json(newPackage);
});

exports.createVariation = catchAsync(async (req, res) => {
  const newVariation = await prisma.variation.create({
    data: {
      expiration: req.body.expiration,
      bdt: req.body.bdt,
      package_id: req.body.package_id,
    },
  });
  res.status(200).json(`variation Created Successfully: ${newVariation}`);
});

exports.findAllPackages = catchAsync(async (req, res) => {
  console.log("api for packages");
  const packages = await prisma.package.findMany();
  res.status(200).json(packages);
});

exports.findAPackage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const package = await prisma.package.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (package) {
    res.status(200).json(package);
  } else {
    res.status(404).json(`No package found with this id: ${id}`);
  }
});

exports.findAllPackagesWithVariation = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (id) {
    const packageVariation = await prisma.package.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        variations: true,
      },
    });
    res.status(200).json(packageVariation);
  } else {
    const packageVariation = await prisma.package.findMany({
      include: {
        variations: true,
      },
    });
    res.status(200).json(packageVariation);
  }
});
