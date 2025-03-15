// --- Settings --- //
var BankList_Url = "https://raw.githubusercontent.com/HeiTang/MailCat/main/bank_list.json";
var BankRule_Url = "https://raw.githubusercontent.com/HeiTang/MailCat/main/bank_rule.json";
var GCP_project_id = "" // GCP Project ID
var GCS_bucket_name = "" // Set your desired bucket name
// --- Settings --- //

function getAuthHeaders_() {
  return {
    Authorization: "Bearer " + ScriptApp.getOAuthToken()
  };
}

// B1-在 Google Cloud Storage 建立 Bucket
function CreateBucket(GCP_project_id, GCS_bucket_name) {
  const projectId = GCP_project_id; 
  const bucketName = GCS_bucket_name; 
  const url = "https://storage.googleapis.com/storage/v1/b?project=" + projectId;

  const payload = JSON.stringify({
    name: bucketName, // The name of your new bucket
    location: "US", // Set the storage location (e.g., US, ASIA, EUROPE)
    storageClass: "STANDARD" // Options: MULTI_REGIONAL, REGIONAL, NEARLINE, COLDLINE
  });

  const options = {
    method: "POST",
    contentType: "application/json",
    headers: getAuthHeaders_(),
    payload: payload
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    console.log(data.name); // Output only the bucket name
  } catch (error) {
    console.error("Error creating bucket:", error);
  }
}

// B2-更新銀行規則 (`bank_list`, `bank_rule`) 至已建立的 Bucket
function UpdateBankInfo(content, fileName) {
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${GCS_bucket_name}/o?uploadType=media&name=${encodeURIComponent(fileName)}`;
  const options = {
    method: "POST",
    contentType: "application/json",
    headers: getAuthHeaders_(),
    payload: content
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    console.log("File uploaded:", response.getContentText()); // Output file name
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

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