import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  axios.defaults.withCredentials = true;

  const {backendurl} = useContext(AppContext);

  const inputRef = React.useRef([]);
  const navigate = useNavigate();
  
  const handleInput = (e,index) => {
      if(e.target.value.length > 0 && INDEX < inputRef.current.length - 1 )  {
        inputRef.current[index + 1].focus();
      }
  }
  
  const handleKeyDown = (e,index) => {
      if(e.key ==='Backspace' && e.target.value == '' && index > 0) {
        inputRef.current[index - 1].focus();
      }
  }
  
  const handlePaste = (e) => {
      const paste = e.clipboardData.getData('text');
      const pasteArray = paste.split(' ');
      pasteArray.forEach((char,index) => {
           if(inputRef.current[index]) {
            inputRef.current[index].value = char;
           }
      });
  }
  const [email,setEmail] = useState('');
  const [newPassword,setNewPassword] = useState('');
  const [isEmailSent,setisEmailSent] = useState('');
  const [otp,setOtp] = useState(0);
  const [isOtpSubmit,setisOtpSubmit] = useState(false);

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
       const {data} = await axios.post(backendurl + '/auth/sendResetOTP',{email});

       data.success ? toast.success(data.message) : toast.error(data.message);
       data.success && setisEmailSent(true)
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onOtpSumit = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((e) => e.value);
    setOtp(otpArray.join(''));
    setisOtpSubmit(true)
  }

  const onSumitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendurl + 'auth/resetPassword',{email,otp,newPassword});
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

    {!isEmailSent && 
      <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the registered Email address</p>
          <div className='mb-4 flex items-center gap=3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" 
            placeholder='Email id' 
            className='bg-transparent outline-none text-white'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>
      </form>

    }

      {!isOtpSubmit && isEmailSent && 
        <form onSubmit={onOtpSumit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter 6-digit code sent to your Email id</p>
          <div className='flex justify-between mb-8'onPaste={(e) => {handlePaste}}>
          {Array(6).fill(0).map((_,index) => (
            <input type="text" 
            maxLength='1' 
            key={index} 
            required 
            className='w-12 h-12 bg-[#333A5C] text-white text-xl text-center rounded-md ' ref={e => inputRef.current[index] = e} 
            onInput={(e) => handleInput(e,index)} 
            onKeyDown={(e) => handleKeyDown(e,index)} 
             />
          ))}

        </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>
      </form>
      }
      
      {isOtpSubmit && isEmailSent && 
        <form onSubmit={onSumitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter the Password</p>
            <div className='mb-4 flex items-center gap=3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.lock_icon} alt="" className='w-3 h-3' />
              <input type="password" 
              placeholder='password' 
              className='bg-transparent outline-none text-white'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              />
            </div>
            <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
              Submit
            </button>
        </form>
      }
      

    </div>
  )
}

export default ResetPassword
