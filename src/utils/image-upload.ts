import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export class ImageUpload {
  static async upload(file: File) {
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const imageType = file.type;

    const resp = await cloudinary.uploader.upload(
      `data:${imageType};base64,${base64Image}`,
      {
        folder: "astro-store/products",
      }
    );

    return resp.secure_url;
  }

  static async delete(image: string) {
    const imageName = image.split("/").pop() ?? "";
    const imageId = imageName.split(".")[0];
    try {
      const resp = await cloudinary.uploader.destroy(imageId);
      return resp;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
