import { Hono } from "hono";
import { CustomContext } from "../env";
import { CDN_URL } from "../constants";

// files are served inline from the cdn, so only allow media types that can't run scripts (no svg/html)
const ALLOWED_CONTENT_TYPES = [
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp",
	"image/avif",
	"video/mp4",
	"video/webm"
]
const MediaController = new Hono<CustomContext>()
MediaController.put("/upload", async (c) => {
	const R2 = c.env.R2 as R2Bucket;
	const formData = await c.req.formData();
	const file = formData.get("file") as File;
	if (!file) {
		return c.json({ success: false, message: "No file provided" }, 400);
	}
	if (!(file instanceof File) || !ALLOWED_CONTENT_TYPES.includes(file.type)) {
		return c.json({ success: false, message: "Unsupported file type" }, 400);
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