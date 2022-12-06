const express = require('express');

const packageController = require('../controllers/packageController');

const router = express.Router();

router.post('/create', packageController.createPackage);
router.post('/create-variation', packageController.createVariation);
router.get(
  '/packages-variations',
  packageController.findAllPackagesWithVariation
);
router.get(
  '/packages-variations/:id',
  packageController.findAllPackagesWithVariation
);
router.get('/', packageController.findAllPackages);
router.get('/:id', packageController.findAPackage);

module.exports = router;
