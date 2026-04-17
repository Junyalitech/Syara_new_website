import React from 'react'
import Hero from '../components/syaraLandingPage/Hero'
import Categories from '../components/syaraLandingPage/Categories';
import TopProducts from '../components/syaraLandingPage/TopProducts';
import PromoBanners from '../components/syaraLandingPage/PromoBanners';
import DealOfWeek from '../components/syaraLandingPage/DealOfWeek';
import DealOfDay from '../components/syaraLandingPage/DealOfDay';
import ShopSection from '../components/syaraLandingPage/ShopSection';

import BottomThreeCards from '../components/syaraLandingPage/BottomThreeCards';

const HomePage = () => {
  return (
    <div>
      <Hero/>
      <Categories/>
      <TopProducts/>
      <PromoBanners/>
      <DealOfWeek/>
      {/* <DealOfDay/> */}
      {/* <ShopSection/> */}
      {/* <BottomThreeCards/> */}
    </div>
  )
}

export default HomePage