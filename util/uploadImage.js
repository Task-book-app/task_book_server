import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (picture, username) => {
  try {
    cloudinary.uploader.upload(
      picture,
      {
        folder: `tasks_book/users/${username}/avatar`,
        use_filename: true,
      },
      (error, result) => {
        if (error) throw new Error(`Image was not valid`);
        console.log(result);
        return result.secure_url;
      }
    );
  } catch (error) {
    error.statusCode = 404;
    return error;
  }
};
