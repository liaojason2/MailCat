function getFile(file) {
  const bucketName = 'bank_info_bucket';
  const fileName = file;

  const blob = getBucketFile_(bucketName, fileName);

  if (blob) {
    const jsonData = JSON.parse(blob.getDataAsString()); // Convert Blob to JSON
    return jsonData;
  } else {
    console.warn("Failed to retrieve the file.");
    return null;
  }
}

function getBucketFile_(BUCKET_NAME, OBJECT_NAME) {
  const url = `https://storage.googleapis.com/storage/v1/b/${BUCKET_NAME}/o/${encodeURIComponent(OBJECT_NAME)}?alt=media`;
  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + ScriptApp.getOAuthToken()
      }}
    );
    return response.getBlob(); // Convert response to Blob
  } catch (error) {
    console.warn('Error getting file:', error.toString());
    return null;
  }
}