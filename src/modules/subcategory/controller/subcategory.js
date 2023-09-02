import slugify from "slugify";
import categoryModel from "../../../../DB/model/Category.model.js";
import subcategoryModel from "../../../../DB/model/Subcategory.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ModifyError } from "../../../utils/classError.js";
import { StatusCodes } from "http-status-codes";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { countPage } from "../../../utils/countPage.js";

export const add = async (req, res, next) => {
  const { name, categoryId } = req.body;
  const checkCat = await categoryModel.findById(categoryId);
  if (!checkCat)
    return next(new ModifyError("in-valid categoryId", StatusCodes.NOT_FOUND));
  const checkSubName = await subcategoryModel.findOne({ name });
  if (checkSubName) {
    return next(
      new ModifyError("subcategory already exist", StatusCodes.CONFLICT)
    );
  }
  if (req.file) {
    const image = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `ecommerce/category/${checkCat.name}/subcategory/${name}/` },
      (err, result) => {
        return console.log({ result, err });
      }
    );

    req.body.image = {
      public_id: image.public_id,
      secure_url: image.secure_url,
    };
  }
  req.body.slug = slugify(name);
  req.body.createdBy = req.user._id;
  const subcategory = await subcategoryModel.create(req.body);

  return res.status(200).json({ message: "done", subcategory });
};

export const deleteSubcategory = async (req, res, next) => {
  const { subcategoryId } = req.params;
  const subcategory = await subcategoryModel.findByIdAndDelete(subcategoryId);
  if (!subcategory)
    return next(
      new ModifyError("invalid subcategory id", StatusCodes.NOT_FOUND)
    );
  //   console.log({ public_id: subcategory.public_id });
  await cloudinary.uploader
    .destroy(subcategory.image.public_id)
    .then((result) => console.log({ result }))
    .catch((err) => {
      console.log(err);
    });
  return res.status(200).json({ message: "done" });
};

export const getAllSubcategories = async (req, res, next) => {
  const model = subcategoryModel.find().populate([{ path: "categoryId" }]);

  const api = new ApiFeatures(model, req.query)
    .search()
    .sort()
    .select()
    .filter()
    .pagination();
  const subcat = await api.mongooseQuery;
  if (!req.query.noDoc)
    return next(new ModifyError("no data matched", StatusCodes.BAD_REQUEST));
    const noPage = countPage(req);

  return res
    .status(200)
    .json({ message: "done", subcat, NODoc: req.query.noDoc, NoPage: noPage });
};

export const getById = async (req, res, next) => {
  const { id } = req.params;
  const subcat = await subcategoryModel.findById(id).populate([
    {
      path: "categoryId",
    },
  ]);
  if (!subcat)
    return next(new ModifyError("no data matched", StatusCodes.BAD_REQUEST));
  return res.status(200).json({ message: "done", subcat });
};

export const updateSubcategory = async (req, res, next) => {
  const checkSubcategory = await subcategoryModel.findOne({
    _id: req.params.subcategoryId,
    categoryId: req.body.categoryId,
  });

  if (!checkSubcategory)
    return next(
      new ModifyError("subcategory does not exist", StatusCodes.NOT_FOUND)
    );

  if (req.body.name) {
    const checkName = await subcategoryModel.findOne({
      name: req.body.name,
      _id: { $ne: req.params.subcategoryId },
      categoryId: req.body.categoryId,
    });
    if (checkName)
      return next(
        new ModifyError("name is already exist", StatusCodes.CONFLICT)
      );
    req.body.slug = slugify(req.body.name);
  }

  if (req.file) {
    const category = await categoryModel.findById(req.body.categoryId);
    // console.log({ checkSubcategory: checkSubcategory.image });
    await cloudinary.uploader.destroy(
      checkSubcategory.image.public_id,
      (err, result) => {
        console.log({ type: "delete Image", result, err });
      }
    );
    // await cloudinary.api.delete_folder(
    //   `ecommerce/categoryId/${category.name}/subcategory`,
    //   (err, result) => {
    //     console.log({ type:"delete folder",result, err });
    //   }
    // );
    const img = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `ecommerce/categoryId/${category.name}/subcategory/${
          req.body.name || checkSubcategory.name
        }/`,
      },
      (err, result) => {
        console.log({ type: "update Image", result, err });
      }
    );
    req.body.image = { public_id: img.public_id, secure_url: img.secure_url };
  }

  await subcategoryModel.updateOne({ _id: req.params.subcategoryId }, req.body);

  return res.status(200).json({ message: "done" });
};

export const getByName = async (req, res, next) => {
  const { searchKey } = req.query;

  const subcat = await subcategoryModel.find({
    name: { $regex: `^${searchKey}` },
  });
  //   console.log(subcat.length);
  if (!subcat.length)
    return next(new ModifyError("no data match", StatusCodes.BAD_REQUEST));

  return res.status(200).json({ message: "done", subcat });
};
