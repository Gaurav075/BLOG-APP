import conf from "../conf/conf";
import { Client, Databases, Query, Storage, ID } from "appwrite";

export class PostService {
    client = new Client();
    databases;
    storage
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPost({ title, content, status = "active", featuredImage, userId, author }) {
        const id = ID.unique();
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, id, {
                title: title.trim().toLowerCase(),
                content,
                status,
                featuredImage,
                userId,
                author,
                likes: 0,
                dislikes: 0
            })

        } catch (error) {
            console.log("Appwrite Error: post.js : in createPost :", error)
            return null;
        }
    }

    async updateLikeandDislikes({ slug, likes, dislikes }) {
        try {
            await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, {
                likes: likes, dislikes: dislikes
            })
            return true
        } catch (error) {
            console.log("Appwrite Error: post.js : in updateLikeandDislikes :", error)
            return null;
        }
    }


    async updatePost({ slug, title, content, status = "active", featuredImage, author }) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, {
                title: title.trim().toLowerCase(), featuredImage, content, status, author
            })
        } catch (error) {
            console.log("Appwrite Error: post.js : in updatePost :", error)
            return null;
        }
    }

    async getPost({ slug }) {
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
        } catch (error) {
            console.log("Appwrite Error: post.js : in getPost :", error)
            return null;
        }
    }
    async getPostDetails({ slug }) {
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwritePostDetailsCollectionId, slug)
        } catch (error) {
            console.log("Appwrite Error: post.js : in getPost :", error)
            return null;
        }
    }

    async deletePost({ slug }) {
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
            return true;
        } catch (error) {
            console.log("Appwrite Error: post.js : in deletePost :", error)
            return false;
        }
    }

    async getAllPost({ key = "status", value = "active", offset = 0 }) {
        //value must be an array,and key is string
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId,
                [
                    Query.limit(25),
                    Query.offset(offset),
                    Query.orderAsc('title'),
                    Query.equal(key, [value])
                ])
        } catch (error) {
            console.log("Appwrite Error: post.js : in getAllPost :", error)
            return null;
        }
    }

    async addComment({ content, author, authorPhoto }) {
        try {

        } catch (error) {
            console.log("Appwrite Error: post.js : in add comment :", error)
            return false;
        }
    }

    async deleteComment({ content, author, authorPhoto }) {
        try {

        } catch (error) {
            console.log("Appwrite Error: post.js : in deleteComment :", error)
            return false;
        }
    }

    // file 

    async uploadImage(file) {
        try {
            return await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file)
        } catch (error) {
            console.log("Appwrite Error: post.js : in uploadImage :", error)
            return false;
        }
    }
    async uploadProfileImage({ file, id }) {
        try {
            return await this.storage.createFile(conf.appwriteBucketId, id, file)
        } catch (error) {
            console.log("Appwrite Error: post.js : in uploadImage :", error)
            return false;
        }
    }

    async deleteImage(fileId) {
        try {
            await this.storage.deleteFile(conf.appwriteBucketId, fileId)
            return true;
        } catch (error) {
            console.log("Appwrite Error: post.js : in deleteImage :", error)
            return false;
        }
    }

    getPreview({ fileId, quality, gravity = "center", width = undefined, height = undefined }) {

        try {
            return this.storage.getFilePreview(conf.appwriteBucketId, fileId, width, height, gravity, quality)
        } catch (error) {
            console.log("Appwrite Error: post.js : getPreview :", error)
            return null;
        }
    }
    getView(fileId) {
        try {
            return this.storage.getFileView(conf.appwriteBucketId, fileId)
        } catch (error) {
            console.log("Appwrite Error: post.js : getPreview :", error)
            return null;
        }
    }

    downloadImage(fileId) {
        try {
            return this.storage.getFileDownload(conf.appwriteBucketId, fileId)
        } catch (error) {
            console.log("Appwrite Error: post.js : getPreview :", error)
            return null;
        }
    }

}

const postService = new PostService();

export default postService;