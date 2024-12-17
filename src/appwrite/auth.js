import { Client, Account, ID, Storage, Databases } from "appwrite";
import conf from '../conf/conf'

export class AuthService{
    client = new Client();
    account;
    databases;
    storage;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.account= new Account(this.client);
        this.databases=new Databases(this.client);
        this.storage= new Storage(this.client);
    }

    async createAccount({name,email,password}){
        const id=name;
        try {
        const user = await this.account.create(id,email,password,name);
        if (user) {
            
            return this.login({email,password});
        }else{
            return false;
        }
        } catch (error) {
            console.log("Appwrite Error: in createAccount :",error)
            return error.message;
        }
    }

    async login({email,password}){
        try {
            return await this.account.createEmailSession(email,password);
        } catch (error) {
            console.log("Appwrite Error: in login :",error)
            return error.message;
        }
        
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite Error: in getCurrentUser :",error)
            return null;
        }
    }

    async logout(){
        try {
            await this.account.deleteSessions();
            return true;
        } catch (error) {
            console.log("Appwrite Error: in logout :",error)
            return false;
        }
    }
    
    async getPreferences(){
        try {
            return await this.account.getPrefs();
        } catch (error) {
            console.log("Appwrite Error: in getPreferences :",error)
            return null;
        }
    }
    async updatePreferences(pref){
        try {
            return await this.account.updatePrefs(pref);
        } catch (error) {
            console.log("Appwrite Error: in updatePreferences :",error)
            return false;
        }
    }

    async updateEmail({email,password}){
        try {
            return await this.account.updateEmail(email,password);
        } catch (error) {
            console.log("Appwrite Error: in updateEmail :",error)
            return error.message;
        }
    }

    

    async updatePassword({newPassword,oldPassword}){
        try {
            return await this.account.updatePassword(newPassword,oldPassword);

        } catch (error) {
            console.log("Appwrite Error: in updatePassword :",error)
            return error.message;
        }
    }
    
    async createRecovery({email}){
        try {
            await this.account.createRecovery(email,'https://mega-blog-coral.vercel.app/recovery-confirmation');
            return true;
        } catch (error) {
            console.log("Appwrite Error: in createRecovery :",error)
            return error.message;
        }
    }
    
    async recoveryConfirm({userid,token,password1,password2}){
        try {
            await this.account.updateRecovery(userid,token,password1,password2)
            return true
        } catch (error) {
            console.log("Appwrite Error: in recoveryConfirm :",error)
            return error.message;
        }
    }
    
    async getSession(sessionId){
        try {
            return await this.account.getSession(sessionId)
        } catch (error) {
            console.log("Appwrite Error: in getSession:",error)
            return false
        }
    }
    async deleteSession(sessionId){
        try {
            await this.account.deleteSession(sessionId);
            return true;
        } catch (error) {
            console.log("Appwrite Error: in deleteSession :",error)
            return false
        }
    }
    
    async createEmailVeryfication(){ 
        try {
            await this.account.createVerification('https://mega-blog-coral.vercel.app/confirm-verification');
            return true
        } catch (error) {
            console.log("Appwrite Error: in createEmailVeryfication :",error)
            return false
        }
    }
    async confirmEmailVeryfication({userid,token}){
        try {
            await this.account.updateVerification(userid,token);
            return true
        } catch (error) {
            console.log("Appwrite Error: in confirmEmailVeryfication :",error)
            return error.message;
        }
    }
    
    // user metadata 
    
    async setUserData({name,email}){
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId,conf.appwriteUserDetailsCollectionId,name,{
                userName:name,
                email,
                fullName:name,
                liked:"[]",
                disliked:"[]"
            })
        } catch (error) {
            console.log("Appwrite Error: in setUserData :",error)
            return false
        }
    }
    async updateUserData({...data},id){
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteUserDetailsCollectionId,id,{...data})
        } catch (error) {
            console.log("Appwrite Error: in updateuserData :",error)
            return error.message;
        }
    }
    async getUserData(id){
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId,conf.appwriteUserDetailsCollectionId,id)
        } catch (error) {
            console.log("Appwrite Error: in getuserData :",error)
            return null;
        }
    }

}


const authService = new AuthService()

export default authService;