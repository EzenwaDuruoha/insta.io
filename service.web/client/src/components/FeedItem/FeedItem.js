import React from 'react'
import './feeditem.scss'

function FeedItem(props) {
  const {data} = props
  console.log('FEED-DATA: ', data)
  return (
    <div className="FeedItem">
      HELLO WORLRD
    </div>
  );
}

export default FeedItem
