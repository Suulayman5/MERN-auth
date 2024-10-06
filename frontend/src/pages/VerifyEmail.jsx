import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const VerifyEmail = () => {
    const [code, setCode] = useState(["","","","","",""])
    const inputRefs = useRef([])
    const navigate = useNavigate()

   const{error, isLoading, verifyEmail} = useAuthStore()

    const handleChange = (index, value) => {
        const newCode = [...code];
      
        if (value.length > 1) {
          // Handle pasting of code
          const pastedCode = value.slice(0, 6).split('');
          for (let i = 0; i < 6; i++) {
            newCode[i] = pastedCode[i] || '';
          }
          setCode(newCode);
      
          // Focus on the next empty input after the last filled digit
          const lastFilledIndex = newCode.findLastIndex(digit => digit !== "");
          const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
          inputRefs.current[focusIndex].focus(); // Fix: Add ()
        } else {
          // Handle single character input
          newCode[index] = value;
          setCode(newCode);
      
          // Move focus to the next input if not the last one
          if (value && index < 5) {
            inputRefs.current[index + 1].focus();
          }
        }
      };
      

    const handleKeyDown = (index, e)=>{
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent form submission if there's an event
      
        const verificationCode = code.join('');
        try {
          await verifyEmail(verificationCode); // Call your verification function
          navigate('/');  // Redirect after success
          toast.success('Email verified successfully');  // Show success message
        } catch (error) {
          console.error('Verification failed:', error);  // Log any errors
          toast.error('Verification failed, please try again.'); // Show error message
        }  
      };
      
      useEffect(() => {
        // Check if all digits are entered before submitting
        if (code.every(digit => digit !== '')) {
          handleSubmit();  // Call handleSubmit when code is complete
        }
      }, [code]);  // Trigger when `code` changes
      
    
  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <motion.div  initial={{opacity: 0, y: 20}}
            animate={{opacity:1, y: 0}}
            transition={{duration: 0.5}}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8'
        >
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                Verify Your Email
            </h2>
            <p className="text-center text-gray-300 mb-6">Enter the 6-digit code sent to your email address</p>
        
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className="flex justify-between">
                    {code.map((digit, index)=>(
                        <input key={index} ref={(el)=>(inputRefs.current[index] = el)} type='text'
                          maxLength={6} value={digit} onChange={(e)=>handleChange(index, e.target.value)} onKeyDown={(e)=> handleKeyDown(index, e)}
                          className='w-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-700 rounded-lg focus:border-green-500 focus:outline-none'
                         />
                    ))}
                </div>
                {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                <motion.button className='mt-5 py-3 w-full px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600
                    hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    focus:ring-offset-gray-900 transition duration-200'
                    whileHover={{scale: 1.02}} whileTap={{scale: 1}} 
                    type='submit'
                    disabled={isLoading}
                    >
                        
                        {isLoading ? (
                            <div className="flex items-center justify-center"> <Loader className="w-6 h-6 animate-spin" />
                                <span className="ml-2">Verifying...</span>
                            </div> ) : ( 'Verify Email')
                        }

                </motion.button>
            </form>
        </motion.div>
    </div>
  )
}

export default VerifyEmail