import slugify from "slugify";
import productModel from "../../../../DB/model/Product.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import subcategoryModel from "../../../../DB/model/Subcategory.model.js";
import { ModifyError } from "../../../utils/classError.js";
import { StatusCodes } from "http-status-codes";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { countPage } from "../../../utils/countPage.js";

export const add = async (req, res, next) => {
  const product = req.body;

  const checkName = await productModel.findOne({ name: product.name });
  if (checkName) {
    checkName.stock += +product.quantity;
    await checkName.save();
    return res.status(200).json({ message: "done", checkName });
  }

  const checkSubcategory = await subcategoryModel.findOne({
    _id: product.subcategoryId,
    categoryId: product.categoryId,
  });
  if (!checkSubcategory)
    return next(
      new ModifyError("Subcategory ID does not exist", StatusCodes.BAD_REQUEST)
    );

  const checkBrand = await brandModel.findById(product.brandId);
  if (!checkBrand)
    return next(
      new ModifyError("Brand does not exist", StatusCodes.BAD_REQUEST)
    );

  product.slug = slugify(product.name);

  product.paymentPrice =
    product.price - ((product.discount || 0) * product.price) / 100;

  product.colors = JSON.parse(product.colors);
  product.sizes = JSON.parse(product.sizes);

  const img = await cloudinary.uploader.upload(
    req.files.image[0].path,
    {
      folder: `ecommerce/product/${product.name}/img`,
    },
    (err, result) => {
      console.log({ type: "uploadImage", err, result });
    }
  );
  product.image = { public_id: img.public_id, secure_url: img.secure_url };

  if (req.files.coverImage) {
    const coverImgs = [];
    for (const img of req.files.coverImage) {
      const coverImg = await cloudinary.uploader.upload(
        img.path,
        {
          folder: `ecommerce/product/${product.name}/coverImg`,
        },
        (err, result) => {
          console.log({ type: "uploadCoverImage", err, result });
        }
      );
      coverImgs.push({
        public_id: coverImg.public_id,
        secure_url: coverImg.secure_url,
      });
    }
    product.coverImage = coverImgs;
  }
  product.createdBy = req.user.id;
  const finalProduct = await productModel.create(product);
  return res.status(200).json({ message: "done", finalProduct });
};

export const search = async (req, res, next) => {
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
  .search()
  .select()
  .filter()
  .pagination()
  .sort()
  const product = await apiFeatures.mongooseQuery;
  if (!req.query.noDoc)
    return next(new ModifyError("No data matched", StatusCodes.NOT_FOUND));

  const noPage = countPage(req);

  return res.status(200).json({
    message: "done",
    product,
    NODoc: req.query.noDoc,
    NoPage: noPage,
    currentPage: req.query.page,
  });
};

export const remove = async (req, res, next) => {
  const product = await productModel.findByIdAndDelete(req.params.id);
  if (!product)
    return next(new ModifyError("id does not exist", StatusCodes.BAD_REQUEST));

  await cloudinary.uploader.destroy(product.image.public_id, (err, result) => {
    console.log({ type: "deleteImage", err, result });
  });
  if (product.coverImage) {
    await cloudinary.api.delete_resources_by_prefix(
      `ecommerce/product/${product.name}/coverImg`,
      (err, result) => {
        console.log({ type: "DeleteCoverImage", result, err });
      }
    );
  }
  return res.status(200).json({ message: "done" });
};

export const update = async (req, res, next) => {
  const { id } = req.params;
  const checkProduct = await productModel.findById(id);
  if (!checkProduct)
    return next(new ModifyError("invalid product id", StatusCodes.NOT_FOUND));
  if (req.body.name) {
    const checkName = await productModel.findOne({ name: req.body.name });
    if (checkName)
      return next(
        new ModifyError("name is already exist", StatusCodes.CONFLICT)
      );
    req.body.slug = slugify(req.body.name);
  }
  if (req.body.price || req.body.discount) {
    req.body.paymentPrice =
    (req.body.price || checkProduct.price) - ((req.body.price || checkProduct.price) *  (req.body.discount || checkProduct.discount)) / 100;
  }

  if (req.body.colors) req.body.colors = JSON.parse(req.body.colors);
  if (req.body.sizes) req.body.sizes = JSON.parse(req.body.sizes);
  if (req.files.image) {
    await cloudinary.uploader.destroy(
      checkProduct.image.public_id,
      (err, result) => {
        console.log({ type: "deleteFromImg", result, err });
      }
    );
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.files.image[0].path,
      {
        folder: `ecommerce/product/${req.body.name || checkProduct.name}/img`,
      },
      (err, result) => {
        console.log({ type: "uploadImage", result, err });
      }
    );
    req.body.image = { public_id, secure_url };
  }
  if (req.files.coverImage) {
    await cloudinary.api.delete_resources_by_prefix(
      `ecommerce/product/${checkProduct.name}/coverImg`,
      (err, result) => {
        console.log({ type: "deleteCoverImage", result, err });
      }
    );
    const coverImg = [];
    for (const img of req.files.coverImage) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        img.path,
        {
          folder: `ecommerce/product/${
            req.body.name || checkProduct.name
          }/coverImg`,
        },
        (err, result) => {
          console.log({ type: "uploadCoverImage", result, err });
        }
      );
      coverImg.push({ public_id, secure_url });
    }
    req.body.coverImage = coverImg;
  }
  await productModel.updateOne({ _id: id }, req.body);
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};
