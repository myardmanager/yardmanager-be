const B2 = require("backblaze-b2");

const b2 = new B2({
	applicationKeyId: process.env.BACKBLAZE_KEY_ID,
	applicationKey: process.env.BACKBLAZE_APP_KEY
});

b2.authorize()
	.then(() => {
		console.log("Authorized backblaze b2");
	})
	.catch((error) => {
		console.log("Error authorizing b2");
	});

const uploadFile = async (file) => {
	const bucketResponse = await b2.getBucket({
		bucketName: "Yard-Manger"
	});
	
	// Get the upload URL
	const uploadUrlResponse = await b2.getUploadUrl({
		bucketId: bucketResponse.data.buckets[0].bucketId
	});
	const fileName = file.originalname.split(".");

	// Upload the file
	const uploadFileResponse = await b2.uploadFile({
		uploadUrl: uploadUrlResponse.data.uploadUrl,
		uploadAuthToken: uploadUrlResponse.data.authorizationToken,
		fileName: `${Date.now()}_media.${fileName[fileName.length - 1]}`,
		data: file.buffer,
		onUploadProgress: null
	});

	return `https://yard-manager.s3.eu-central-003.backblazeb2.com/${uploadFileResponse.data.fileName}`;
};

module.exports = {
	uploadFile
};
