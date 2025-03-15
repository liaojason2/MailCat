// 取得 Google Cloud Storage OAuth token
function getAuthHeaders_() {
  return {
    Authorization: "Bearer " + ScriptApp.getOAuthToken()
  };
}

// B1-在 Google Cloud Storage 建立 Bucket
function CreateBucket(GCP_project_id, GCS_bucket_name) {
  const url = "https://storage.googleapis.com/storage/v1/b?project=" + GCP_project_id;

  const payload = JSON.stringify({
    name: GCS_bucket_name, // The name of your new bucket
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
    Logger.log(`已成功建立 bucket: ${data.name}`); // Output only the bucket name
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
    const data = JSON.parse(response.getContentText());
    Logger.log(`已成功更新: ${data.bucket}/${data.name}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}