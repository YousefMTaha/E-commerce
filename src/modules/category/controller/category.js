import slugify from "slugify";
import cloudinary from "./../../../utils/cloudinary.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ModifyError } from "../../../utils/classError.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { countPage } from "../../../utils/countPage.js";

export const addCategory = async (req, res, next) => {
  const { name } = req.body;
  const isExist = await categoryModel.findOne({ name });
  if (isExist) {
    return next(new ModifyError("name is exist", StatusCodes.CONFLICT));
  }
  const slug = slugify(name);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `ecommerce/category/${name}` },
    (err, result) => {
      console.log({ result, err });
    }
  );
  const category = await categoryModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    createdBy: req.user.id,
  });
  return res
    .status(StatusCodes.CREATED)
    .json({ message: "Done", category, status: ReasonPhrases.CREATED });
};

export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const isExist = await categoryModel.findByIdAndDelete(categoryId);
  if (!isExist) {
    return next(new ModifyError("not found", StatusCodes.NOT_FOUND));
  }
  await cloudinary.uploader.destroy(isExist.image.public_id);
  return res
    .status(StatusCodes.OK)
    .json({ messageL: "done", status: ReasonPhrases.OK });
};

export const updateCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  const checkCategory = await categoryModel.findById(categoryId);
  if (!checkCategory)
    return next(
      new ModifyError("categoryID does not exist", StatusCodes.NOT_FOUND)
    );

  if (req.body.name) {
    const isExist = await categoryModel.findOne({
      name: req.body.name,
      _id: { $ne: categoryId },
    });
    if (isExist) {
      return next(
        new ModifyError(" category already exist", StatusCodes.CONFLICT)
      );
    }
    req.body.slug = slugify(req.body.name);
  }

  if (req.file) {
    const img = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "ecommerce/category",
      },
      (err, result) => {
        console.log({ result, err });
      }
    );
    req.body.image = { public_id: img.public_id, secure_url: img.secure_url };
  }

  console.log({ body: req.body });

  const cate = await categoryModel.updateOne({ _id: categoryId }, req.body);

  console.log({ cate });
  if (req.file) {
    await cloudinary.uploader.destroy(
      checkCategory.image.public_id,
      (err, result) => {
        console.log({ result, err });
      }
    );
  }
  return res.status(200).json({ message: "done" });
};

export const findByName = async (req, res, next) => {
  const { searchKey } = req.query;
  const cate = await categoryModel.find({ name: { $regex: `^${searchKey}` } });
  if (!cate.length)
    return next(new ModifyError("no data matched", StatusCodes.BAD_REQUEST));
  return res.status(200).json({ message: "done", cate });
};
export const findById = async (req, res, next) => {
  const { id } = req.params;
  const cate = await categoryModel.findById(id);
  if (!cate)
    return next(new ModifyError("no data matched", StatusCodes.BAD_REQUEST));
  return res.status(200).json({ message: "done", cate });
};

export const getAllCategories = async (req, res, next) => {
  const cat = categoryModel.find().populate([{ path: "subcategoryId" }]);
  const catFeature = new ApiFeatures(cat, req.query)
    .select()
    .sort()
    .search()
    .filter()
    .pagination();
  const categories = await catFeature.mongooseQuery;
  // console.log({ req:req.query,noDoc: req.query.noDoc });
  if (!req.query.noDoc)
    return next(new ModifyError("no data matched", StatusCodes.BAD_REQUEST));
    const noPage = countPage(req);

  return res
    .status(200)
    .json({
      message: "done",
      categories,
      NODoc: req.query.noDoc,
      NoPage: noPage,
    });
};
