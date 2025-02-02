import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const MyAppointments = () => {
  const { backendUrl, token, getExpertsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const navigate = useNavigate()
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
  }
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
       
      } else {
        toast.error(data.message)
       
      }
    } catch (error) {
     
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        console.log("hello")
        toast.success(data.message)
        getUserAppointments()
        getExpertsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  const initPay = (order, appointmentId, serviceType) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      
      amount:order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        //console.log(response)
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } })
          if (data.success) {
          
            toast.success(data.message)
          

            getUserAppointments()
            navigate('/myAppointments')
           
           

            if (serviceType === 'Virtual') {
              //generate meeting link
              const meetingResponse = await axios.post(
                backendUrl + '/api/user/generate-meeting-link',
                { appointmentId },
                { headers: { token } }
              );

              if (meetingResponse.data.success) {
                const meetingLink = meetingResponse.data.meetingLink;

                // Update appointments with the meeting link
                const updatedAppointments = appointments.map((item) => {
                  if (item._id === appointmentId) {
                    item.meetingLink = meetingLink; // Add the meeting link
                  }
                  return item;
                });
                setAppointments(updatedAppointments);
                getUserAppointments();

                toast.success('Meeting link generated!');

                // Navigate to appointments
                navigate('/myAppointments');
              } else {
                toast.error('Failed to generate meeting link.');
              }

            }
            try{
              const { data: emailData } = await axios.post(backendUrl + '/api/user/send-email', {
                appointmentId: appointmentId, // Use receipt or order id as appointment ID
                token
              }, { headers: { token } });
  
              if (emailData.success) {
                toast.success('Confirmation email sent!');
              } else {
                toast.error('Error sending confirmation email.');
              }

            }catch(error){
              toast.error("Email generation failed");
            }



          } else {
            toast.error(data.message)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()

  }
  //
  const appointmentRazorpay = async (appointmentId, serviceType) => {

    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
      console.log("abe")
      console.log(data)
      if (data.success) {
        initPay(data.order, appointmentId, serviceType)
       
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);

    }


  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }

  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {
          appointments.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div>
              </div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
                {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id, item.serviceType)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300 '>Pay Online</button>}
                {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300 '>Cancel appointment</button>}
                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
                {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Service Completed</button>}
                {item.isCompleted && (
                  <button
                    onClick={() =>
                      navigate(`/submitReview/${item.docData._id}/${item.userData._id}}`)
                    }
                    className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500"
                  >
                    Review Expert
                  </button>
                )}
                {/* Add "Join Meet" button if meetingLink is available */}
                {(item.serviceType === 'Virtual') && item.payment && item.meetingLink && !item.isCompleted && (
                  <a
                    href={item.meetingLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-center sm:min-w-48 py-2 border bg-green-500 text-white hover:bg-green-600 transition-all duration-300'
                  >
                    Join Meet
                  </a>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments