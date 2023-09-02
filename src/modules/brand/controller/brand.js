import slugify from "slugify";
import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ModifyError } from "../../../utils/classError.js";
import { StatusCodes } from "http-status-codes";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { countPage } from "../../../utils/countPage.js";

export const add = async (req, res, next) => {
  const { name } = req.body;

  const checkName = await brandModel.findOne({ name });
  if (!checkName)
    return next(
      new ModifyError("Brand is already exist", StatusCodes.CONFLICT)
    );

  const img = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `ecommerce/brand/${name}` },
    (err, result) => {
      console.log({ err, result });
    }
  );
  console.log({ user_id: req.user._id, userId: req.user.id });

  const brand = await brandModel.create({
    name,
    slug: slugify(name),
    createdBy: req.user._id,
    logo: { public_id: img.public_id, secure_url: img.secure_url },
  });

  return res.status(200).json({ message: "done" });
};

export const update = async (req, res, next) => {
  const { id } = req.params;
  const checkId = await brandModel.findById(id);
  if (!checkId)
    return next(new ModifyError("invalid BrandID", StatusCodes.NOT_FOUND));
  if (req.body.name) {
    const checkName = await brandModel.findOne({
      name: req.body.name,
      _id: { $ne: id },
    });
    if (checkName)
      return next(new ModifyError("name already exist", StatusCodes.CONFLICT));
    req.body.slug = slugify(req.body.name);
  }

  if (req.file) {
    await cloudinary.uploader.destroy(checkId.logo.public_id, (err, result) => {
      console.log({ type: "remove IMG", err, result });
    });

    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `ecommerce/brand/${req.body.name || checkId.name}` }
    );
    req.body.logo = { public_id, secure_url };
  }

  await brandModel.updateOne({ _id: id }, req.body);
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};

export const remove = async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findByIdAndDelete(id);
  if (!brand)
    return next(new ModifyError("brand id not found", StatusCodes.NOT_FOUND));
  await cloudinary.uploader.destroy(brand.image.public_id, (err, result) =>
    console.log({ result, err })
  );
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};

export const getById = async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findById(id);
  if (!brand)
    return next(new ModifyError("brand id not found", StatusCodes.NOT_FOUND));
  return res.status(StatusCodes.ACCEPTED).json({ message: "Done", brand });
};

export const getAllBrands = async (req, res, next) => {
  const api = new ApiFeatures(brandModel.find(), req.query)
    .select()
    .sort()
    .search()
    .filter()
    .pagination();
  const brands = await api.mongooseQuery;
  if (!req.query.noDoc)
    return next(new ModifyError("no data matched", StatusCodes.BAD_REQUEST));
  const noPage = countPage(req);

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "done", brands, NODoc: req.query.noDoc, NoPage: noPage });
};
