import API, { setTokens } from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'
import { AppContext } from '@/context/AppContext';
import { useContext } from 'react';
import { toast } from "react-toastify";

const URL = 'auth';


export function useSignin() {

  // const context = useContext(AppContext);

  // if (!context) {
  //   console.log('useSignin must be used within an AppProvider');
  // }
  // const { setUserData } = context || {};
  return useMutation({
    mutationFn: (data) => API.post(`${URL}/sign-in`, data),
    onSuccess: (res) => {
      const combinedUserData = {
        ...res.data[0],
        ...res.data[1],
      };

      // Still keep localStorage for client-side usage if needed
      localStorage.setItem('currentUser', JSON.stringify(combinedUserData));
      localStorage.setItem(
        'token',
        JSON.stringify(combinedUserData.access_token)
      );

      // Add token to cookies for middleware authentication
      Cookies.set('token', combinedUserData.access_token, {
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
      });

      setTokens({
        access: combinedUserData.access_token,
        refresh: combinedUserData.refresh_token,
      });
      
      toast.success("Sign In Successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
