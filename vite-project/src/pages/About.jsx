import React from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'




const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT < span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]'src={assets.about_image} alt=""/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to EarthWise, your trusted partner in sustainability and environmental solutions. At EarthWise, we are dedicated to helping individuals, businesses, and communities adopt eco-friendly practices that contribute to a healthier planet.</p>
          <p>We specialize in areas such as solar panel installation, energy auditing, waste management, urban farming, gardening consultancy, and composting advisory. Our team of experts is passionate about making sustainability accessible, practical, and impactful for everyone.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Our vision at EarthWise is to create a greener, cleaner world by empowering people with knowledge and solutions to embrace sustainable living. We aim to bridge the gap between modern challenges and environmentally conscious practices, ensuring that every step you take toward sustainability is supported and guided by our expertise.

Together, let’s build a future where environmental responsibility is a way of life. 🌿</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer '>
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>

        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer '>
          <b>CONVENIENCE:</b>
          <p>Connect with a reliable network of experienced healthcare professionals near you.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer '>
          <b>PERSONALIZATION:</b>
          <p>Personalized recommendations and eco-friendly reminders to help you stay committed to a sustainable lifestyle.</p>

        </div>
      </div>
    </div>
  )
}

export default About


