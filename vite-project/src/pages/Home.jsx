// import React from 'react'


// const Home = () => {
//   return (
//     <div className="text-green-500" >
//         hello
//     </div>
//   )
// }

// export default Home
import React from 'react';
import Header from '../components/Header';
import TutorialSection from '../components/TutorialSection';
import SpecialityMenu from '../components/SpecialityMenu';
import TopExperts from '../components/TopExperts';
import Banner from '../components/Banner';
import EventsSlider from '../components/EventsSlider';
import ReviewSlider from '../components/ReviewSlider';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import Workshop from '../components/Workshop';
const Home =()=>{
  return(
    <div className="">
     <Header/>
     {/* <SkeletonLoader/> */}
     <TutorialSection/>
     <SpecialityMenu/>
     <Workshop/>
     <TopExperts/>
     <Banner/>
     <EventsSlider/>
     <ReviewSlider/>
     
    </div>
  );
}
export default Home;