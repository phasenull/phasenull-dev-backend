import { Hono } from "hono";
import { CustomContext } from "../env";
import { CDN_URL } from "../constants";

const MediaController = new Hono<CustomContext>()
MediaController.put("/upload", async (c) => {
	const R2 = c.env.R2 as R2Bucket;
	const formData = await c.req.formData();
	const file = formData.get("file") as File;
	if (!file) {
		return c.json({ success: false, message: "No file provided" }, 400);
	}
	if (file.size > 50 * 1024 * 1024) {
		return c.json({ success: false, message: "File size exceeds 50MB" }, 400);
	}
	const file_name = crypto.randomUUID().replaceAll("-","").toLocaleLowerCase()
	const uploadResult = await R2.put(`uploads/${file_name}`, file.stream(),{
		httpMetadata: {
			contentType: file.type,
			// return image preview instead of downloading
			contentDisposition: `inline; filename="${file_name}"`,
			cacheControl: "public, max-age=31536000, immutable"

		},
		customMetadata: {
			uploadedAt: new Date().toISOString()
		}
	});
	if (!uploadResult) {
		return c.json({ success: false, message: "Failed to upload file" }, 500);
	}
	return c.json({ success: true, message: "File uploaded successfully", url: `${CDN_URL}/${uploadResult.key}` });
})
export default MediaController;