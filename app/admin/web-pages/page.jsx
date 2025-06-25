import { getAllPages } from '@/app/actions/content-pages'
import Pages from '@/components/pages/content/AdminPageEditor';
import React from 'react'

const page = async () => {

  const { data, error } = await getAllPages();

  if (error) {
    return (
      <div>
        <h1 className='text-center py-20'>Something went wrong!</h1>
      </div>
    )
  }

  return (
    <div>
      <Pages data={data} />
    </div>
  )
}

export default page
