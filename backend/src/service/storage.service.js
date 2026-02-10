import ImageKit from "imagekit";

// SDK initialization
const imagekitClient = new ImageKit({
  publicKey: "public_LSALzyyf3xdjiwD3tlgEwSWVnDk=",
  privateKey: "private_6pd59GTUwcyi4lu0I2CzSBKU9+Q=",
  urlEndpoint: "https://ik.imagekit.io/riddhesh98",
});

async function fileUpload(file, fileName) {
  try {
    const uploadResponse = await imagekitClient.upload({
      file,
      fileName,
    });
    return uploadResponse;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
}

export default fileUpload;
