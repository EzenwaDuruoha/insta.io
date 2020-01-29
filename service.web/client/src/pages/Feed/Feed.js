import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Header from '../../components/Header/Header'
import FeedItem from '../../components/FeedItem/FeedItem'
import {getUserFeed} from '../../store/reducers/FeedState/actions'
import './feed.scss'

function Feed() {
  const feedState = useSelector((store) => store.feedState)
  const dispatch = useDispatch()
  const {feed = [], isLoading = false} = feedState
  useEffect(() => {
    dispatch(getUserFeed())
  }, [dispatch])

  return (
    <div className="Feed">
      <Header/>
      <main className='feed-body'>
        <section className='feed-con'>
          <div className='feed-stream'>
            {feed.map((item, i) => <FeedItem key={i} data={item} />)}
          </div>
          <div className='snap-br'></div>
          <div className='feed-snap'>
            hey
          </div>
        </section>
	    </main>
    </div>
  )
}

export default Feed
