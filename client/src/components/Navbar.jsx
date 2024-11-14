import React, { useState } from 'react';

function Navbar() {

  return (
    <nav className=''>
      <div className='flex flex-row mx-auto px-[40px] py-[25px] justify-between items-center mt-[0px] bg-black'>
        <div className='font-semibold text-lg text-white'>
          <a href='/'>Invoice</a>
        </div>
        <div className='flex justify-center flex-1 space-x-8 text-center'>
        </div>
        </div>

      <hr className='border-t border-gray-600' />
    </nav>
  );
}

export default Navbar;