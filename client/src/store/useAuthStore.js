import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';  

export const useAuthStore = create((set) => {
  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (e) {
      console.error(e);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  };
  
  const signup = async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (e) {
      toast.error(e.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  };
  
  const logout = async () =>{
    try{
      await axiosInstance.post("/auth/logout");
      set({authUser: null});
      toast.success("Logged out successfully");
    }catch(e){
      console.error(e);
      toast.error("Logout failed");
    }
  }
  const login = async(data)=>{
    set({isLoggingIn:true});
    try{
      const res = await axiosInstance.post("/auth/login",data);
      set({authUser:res.data});
      toast.success("Logged in successfully");
    }catch(e){
      toast.error(e.response.data.message);  
    }finally{
      set({isLoggingIn:false});
    }
  }

  return {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth,
    signup,
    logout,
    login,
  };
});
