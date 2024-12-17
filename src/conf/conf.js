const conf={
    appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteUserDetailsCollectionId:String(import.meta.env.VITE_APPWRITE_USERDETAILS_COLLECTION_ID),
    appwritePostDetailsCollectionId:String(import.meta.env.VITE_APPWRITE_POSTDETAILS_COLLECTION_ID),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    tinyMCEApiKey:String(import.meta.env.VITE_TINY_API_KEY),
}

export default conf;