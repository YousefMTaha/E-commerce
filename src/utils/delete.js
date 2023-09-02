import { ModifyError } from "./classError.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "./cloudinary.js";

export const globalRemove = (model) => {
  return async (req, res, next) => {
    const globalModel = await model.findByIdAndDelete(req.params.id);
    if (!globalModel)
      return next(
        new ModifyError("id does not exist", StatusCodes.BAD_REQUEST)
      );

      await cloudinary.uploader.destroy(globalModel.image.public_id,(err,result)=>{console.log({err,result});})
    return res.status(200).json({ message: "done" });
  };
};
